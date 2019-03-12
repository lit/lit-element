import {PartStyledElement, html, css, part, property, customElement, unsafeCSS} from '../lib/part-styled-element.js';
import {classMap} from 'lit-html/directives/class-map.js';

const margin = '12px';

@customElement('part-ggchild')
export class PartGGChild extends PartStyledElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div part="zot">part-ggchild: zot!</div>
    `;
  }
}

@customElement('part-gchild')
export class PartGChild extends PartStyledElement {
  static styles = css`
    :host {
      display: block;
    }

    [part=bar] {
      border: 10px solid black;
    }
  `;

  render() {
    return html`
      <div part="bar">part-gchild: bar!</div>
      <part-ggchild part="b" exportparts="zot: gchild-zot, b"></part-ggchild>
    `;
  }
}

@customElement('part-child')
export class PartChild extends PartStyledElement {
  static get styles() { return css`
    :host {
      display: block;
    }

    ${part('.noApply::part(bar)', css`
      border-color: orange;
    `)}
  `; }

  render() {
    return html`
      <div part="foo">part-child: foo!</div>
      <part-gchild part="b" exportparts="bar: nug, gchild-zot: child-zot, b"></part-gchild>
    `;
  }
}

@customElement('part-host')
export class PartHost extends PartStyledElement {

  @property({type: Boolean})
  special = false;

  static get styles() { return css`
     :host {
      display: block;
    }

    ${part('part-child::part(foo)', css`
      border: 2px solid orange;
      padding: 4px;
    `)}

    ${part('.special::part(foo)', css`
      border-color: blue;
    `)}

    ${part('part-child::part(nug)', css`
      border: 10px solid red;
    `)}

    ${part('.special::part(nug)', css`
      border-color: blue;
    `)}

    ${part('.special::part(child-zot)', css`
      border: 2px dashed blue;
    `)}

    ${part(['part-child', '*::part(b)'], css`margin: ${unsafeCSS(margin)}`)}

  `; }

  render() {
    const special = this.special;
    return html`
      <div @click="${this._handleClick}">
        <header part="header">part-host</header>
        <part-child exportparts="b" class=${classMap({special})}></part-child>
        <part-child exportparts="b"></part-child>
      </div>
    `;
  }

  _handleClick() {
    this.special = !this.special;
  }
}

@customElement('part-host2')
export class PartHost2 extends PartStyledElement {
  static get styles() { return css`
    :host {
      display: block;
    }

    ${part('part-child::part(foo)', css`
      border: 4px dashed gray;
      padding: 4px;
    `)}

    ${part('part-child::part(nug):hover', css`
      border: 10px solid yellow;
    `)}

    ${part(['part-child', '*::part(b)'], css`margin: ${unsafeCSS(margin)}`)}

  `; }

  render() {
    return html`
      <header part="header">part-host2</header>
      <part-child exportparts="b"></part-child>
    `;
  }
}
