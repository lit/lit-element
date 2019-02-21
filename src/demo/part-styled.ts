import {PartStyledElement, html, css, property, customElement} from '../lib/part-styled-element.js';

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
    `;
  }
}

@customElement('part-child')
export class PartChild extends PartStyledElement {
  static styles = css`
    :host {
      display: block;
      --border: 10px solid red;
    }
  `;

  render() {
    return html`
      <div part="foo">part-child: foo!</div>
      <part-gchild exportparts="bar: nug"></part-gchild>
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

    ${this.partRule('[special] > part-child', 'foo', `
      border: 2px solid orange;
      padding: 4px;
    `)}

    ${this.partRule('[special] > part-child', 'nug', `
      border: var(--border);
    `)}
  `; }

  render() {
    return html`
      <div @click="${this._handleClick}">
        <header>part-host</header>
        <div ?special="${this.special}">
          <part-child></part-child>
        </div>
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

    ${this.partRule('part-child', 'foo', `
      border: 4px dashed gray;
      padding: 4px;
    `)}

    ${this.partRule('part-child', 'nug', `
      border: 6px solid yellow;
    `, 'hover')}
  `; }

  render() {
    return html`
      <part-child></part-child>
    `;
  }
}
