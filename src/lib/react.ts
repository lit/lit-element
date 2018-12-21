/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

// TODO: Write a UMD->module shim or take React as an argument to
// createReactComponent so we don't have to worry about how to load React.
import {Component, createElement} from 'react';

import {UpdatingElement} from './updating-element.js';

export type Constructor<T> = {
  new (): T;
};

const reservedReactProperties =
    [ 'children', 'localName', 'ref', 'style', 'className' ];

/**
 *  Creates a React component from a LitElement or UpdatingElement.
 */
export const createReactComponent =
    <T extends UpdatingElement>(clazz: Constructor<T>, tagName: string) => {
      const setProperty = (node: T, name: string, value: any, old: any) => {
        if ((clazz as any)._classProperties.has(name)) {
          node[name as keyof T] = value;
        } else if (name[0] === 'o' && name[1] === 'n') {
          // TODO(justinfagnani): camel-case to kebab-case conversion?
          if (old) {
            node.removeEventListener(name.substring(2), old);
          }
          if (value) {
            node.addEventListener(name.substring(2), value);
          }
        } else {
          node.setAttribute(name, value);
        }
      };

      return class extends Component {
        base!: T;
        ref!: any;

        constructor(props: {}) {
          super(props);
          this.ref = (c: T) => {
            this.base = c;
            if ((this.props as any).ref) {
              (this.props as any).ref(c);
            }
          };
        }

        componentDidMount() {
          for (const i in this.props) {
            if (reservedReactProperties.indexOf(i) === -1) {
              setProperty(this.base, i, (this.props as any)[i], null);
            }
          }
        }

        componentDidUpdate(old: any) {
          const {props} = this;
          for (const i in props) {
            if (reservedReactProperties.indexOf(i) === -1 &&
                (props as any)[i] !== old[i]) {
              setProperty(this.base, i, (props as any)[i], old[i]);
            }
          }
          for (const i in old) {
            if (reservedReactProperties.indexOf(i) === -1 && !(i in props)) {
              setProperty(this.base, i, null, old[i]);
            }
          }
        }

        componentWillUnmount() {
          for (const i in this.props) {
            if (reservedReactProperties.indexOf(i) === -1) {
              setProperty(this.base, i, null, null);
            }
          }
        }
        render() {
          const props = {ref : this.ref};
          for (const i in this.props) {
            if (reservedReactProperties.indexOf(i) !== -1) {
              (props as any)[i] = (this.props as any)[i];
            }
          }
          return createElement(tagName, props, this.props.children);
        }
      };
    };
