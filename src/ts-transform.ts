import * as ts from 'typescript';

abstract class Visitor {
  protected context: ts.TransformationContext;

  constructor(context: ts.TransformationContext) {
    this.context = context;
  }

  abstract visit(node: ts.Node): ts.VisitResult<ts.Node>;
}

function stripDecorator(node: ts.Node, name: string): ts.Node {
  if (!node.decorators) {
    return node;
  }

  const newDecorators = node.decorators.filter(
    (d) => getDecoratorName(d) !== name);


  if (newDecorators.length === 0) {
    node.decorators = undefined;
  } else {
    node.decorators = ts.createNodeArray(newDecorators);
  }

  return node;
}

function getDecoratorName(decorator: ts.Decorator): string {
  if (ts.isCallExpression(decorator.expression)) {
    return decorator.expression.expression.getText();
  }
  return decorator.expression.getText();
}

function findMatchingDecorators(node: ts.Node, name: string): ts.Decorator[] {
  const decorators = node.decorators;

  if (!decorators) {
    return [];
  }

  const matchingDecorators = decorators.filter(
      (d) => name === getDecoratorName(d));

  return matchingDecorators;
}

function getDecoratorArguments(decorator: ts.Decorator): ts.Expression[] {
  if (ts.isCallExpression(decorator.expression)) {
    return [...decorator.expression.arguments];
  }
  return [];
}

interface IDecoratorVisitor {
  kind: string;
}

class CustomElementVisitor extends Visitor implements IDecoratorVisitor {
  public kind = 'customElement';

  constructor(context: ts.TransformationContext) {
    super(context);
  }

  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (!ts.isClassDeclaration(node) || !node.name) {
      return ts.visitEachChild(node, (child) =>
        this.visit(child), this.context);
    }

    const matchingDecorators = findMatchingDecorators(node, this.kind);

    if (matchingDecorators.length === 0) {
      return node;
    }

    stripDecorator(node, this.kind);

    const args = getDecoratorArguments(matchingDecorators[0]);

    if (args.length === 0) {
      return node;
    }

    const name = args[0];
    const defineCall = ts.createStatement(ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier('customElements'),
        ts.createIdentifier('define')
      ), undefined, [name, node.name]));

    return [node, defineCall];
  }
}

class PropertyVisitor extends Visitor implements IDecoratorVisitor {
  public kind = 'property';

  constructor(context: ts.TransformationContext) {
    super(context);
  }

  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (!ts.isClassDeclaration(node)) {
      return ts.visitEachChild(node, (child) =>
        this.visit(child), this.context);
    }

    const properties = node.members.filter<ts.PropertyDeclaration>(
      (p): p is ts.PropertyDeclaration => ts.isPropertyDeclaration(p));

    let propertiesGetter = node.members.find<ts.GetAccessorDeclaration>((p): p is ts.GetAccessorDeclaration => {
      return ts.isGetAccessor(p) &&
        p.name.getText() === 'properties' &&
        p.modifiers !== undefined &&
        p.modifiers.some((mod) => mod.kind === ts.SyntaxKind.StaticKeyword);
    });
    let propertiesGetterObject: ts.ObjectLiteralExpression;

    if (!propertiesGetter) {
      propertiesGetterObject = ts.createObjectLiteral();
      propertiesGetter = ts.createGetAccessor(
        undefined,
        [ts.createModifier(ts.SyntaxKind.StaticKeyword)],
        'properties',
        [],
        undefined,
        ts.createBlock([
          ts.createReturn(propertiesGetterObject)
        ])
      );

      node.members = ts.createNodeArray([propertiesGetter, ...node.members]);
    } else {
      if (!propertiesGetter.body) {
        return node;
      }

      const getterReturn = propertiesGetter
        .body
        .statements
        .find<ts.ReturnStatement>((s): s is ts.ReturnStatement => {
          return ts.isReturnStatement(s);
        });

      if (!getterReturn ||
        !getterReturn.expression ||
        !ts.isObjectLiteralExpression(getterReturn.expression)) {
        return node;
      }

      propertiesGetterObject = getterReturn.expression;
    }

    const initialPropertyNames = propertiesGetterObject.properties
      .filter((prop) => prop.name)
      .map((prop) => prop.name!.getText());

    for (const prop of properties) {
      const matchingDecorators = findMatchingDecorators(prop, this.kind);

      if (matchingDecorators.length > 0 && prop.name) {
        stripDecorator(prop, this.kind);

        const name = prop.name.getText();

        if (!initialPropertyNames.includes(name)) {
          const newProp = ts.createPropertyAssignment(
            name, ts.createIdentifier(this.createPropertyType(prop)));

          propertiesGetterObject.properties = ts.createNodeArray(
            [...propertiesGetterObject.properties, newProp]);
        }
      }
    }

    return node;
  }

  private createPropertyType(node: ts.PropertyDeclaration): string {
    if (node.type) {
      if (ts.isArrayTypeNode(node.type)) {
        return 'Array';
      }

      if (ts.isTypeReferenceNode(node.type) &&
        node.type.typeName.getText() === 'Array') {
        return 'Array';
      }

      if (node.type.kind === ts.SyntaxKind.BooleanKeyword) {
        return 'Boolean';
      }

      if (node.type.kind === ts.SyntaxKind.NumberKeyword) {
        return 'Number';
      }

      if (node.type.kind === ts.SyntaxKind.StringKeyword) {
        return 'String';
      }
    }

    return 'Object';
  }
}

export function decoratorTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {
    const visitors = [
      new CustomElementVisitor(context),
      new PropertyVisitor(context)
    ];

    const visit: ts.Visitor = (node) => {
      let result: ts.VisitResult<ts.Node> = node;

      for (const visitor of visitors) {
        if (!result) {
          break;
        }

        if (Array.isArray(result)) {
          // What do? some kinda recursion probably needs to go on here
          break;
        }

        result = visitor.visit(result);
      }

      return result;
    };

    return (node) => ts.visitNode(node, visit);
  };
}
