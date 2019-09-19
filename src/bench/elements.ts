import {PartStyledElement, html, css, part, property, customElement, PropertyValues} from '../lib/part-styled-element.js';
import {classMap} from 'lit-html/directives/class-map.js';

@customElement('mwc-button')
export class Button extends PartStyledElement {

  static styles =[css`mdc-button {
      border: 1px solid red;
    }`];


  @property()
  raised = false;

  @property()
  unelevated = false;

  @property()
  outlined = false;

  @property()
  dense = false;

  @property()
  disabled = false;

  @property()
  icon = '';

  @property()
  label = '';

  /*get cssPartNames() {
      if (!this._partNames) {
      this._partNames = new Set(['button']);
      }
      return this._partNames;
  }*/

  render() {
      const classes = {
          'mdc-button--raised': this.raised,
          'mdc-button--unelevated': this.unelevated,
          'mdc-button--outlined': this.outlined,
          'mdc-button--dense': this.dense,
      };
      return html `
    <button part="button"
        class="mdc-button ${classMap(classes)}"
        ?disabled="${this.disabled}"
        aria-label="${this.label || this.icon}">
      ${this.icon ? html `<span part="icon" class="material-icons mdc-button__icon">${this.icon}</span>` : ''}
      ${this.label}
      <slot></slot>
    </button>`;
  }
};

@customElement('my-styled-dialog')
export class MyStyledDialog extends PartStyledElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ${part('.cancel::part(button)', css`
        margin: 4px;
        padding: 4px;
        background-color: white;
        color: green;
        border: 2px solid red;
      `)}

      ${part('.ok::part(button)', css`
        margin: 4px;
        padding: 4px;
        background-color: white;
        color: green;
        border: 2px solid green;
      `)}

    `;
  }

  /*get cssPartNames() {
    if (!this._partNames) {
      this._partNames = new Set(['content']);
    }
    return this._partNames;
  }*/

  render() {
    return html`
      <div part="content">
        Content
        <mwc-button class="cancel" raised outlined>Cancel</mwc-button>
        <mwc-button class="ok" raised outlined>OK</mwc-button>
      </div>`;
  }

}

@customElement('my-dialog')
export class MyDialog extends PartStyledElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  /*get cssPartNames() {
    if (!this._partNames) {
      this._partNames = new Set(['content']);
    }
    return this._partNames;
  }*/

  render() {
    return html`
      <div part="content">
        Content
        <mwc-button exportparts="button: cancel-button" raised outlined>Cancel</mwc-button>
        <mwc-button exportparts="button: accept-button" raised outlined>OK</mwc-button>
      </div>`;
  }

}


@customElement('my-container')
export class MyContainer extends PartStyledElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  /*get cssPartNames() {
    if (!this._partNames) {
      this._partNames = new Set(['container']);
    }
    return this._partNames;
  }*/

  render() {
    return html`
      <div part="container">
        Container
        <my-dialog exportparts="content: dialog1-content, cancel-button: dialog1-cancel-button, accept-button: dialog1-accept-button"></my-dialog>
        <my-dialog exportparts="content: dialog2-content, cancel-button: dialog2-cancel-button, accept-button: dialog2-accept-button"></my-dialog>
      </div>`;
  }

}


@customElement('my-view')
export class MyView extends PartStyledElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ${part('#one::part(dialog1-accept-button)', css`
        background-color: orange;
        border-radius: 10px;
      `)}
    `;
  }

  /*get cssPartNames() {
    if (!this._partNames) {
      this._partNames = new Set(['view']);
    }
    return this._partNames;
  }*/

  render() {
    return html`
      <div part="view">
        View
        <my-container id="one" exportparts="container: container1-container, dialog1-content: container1-dialog1-content, dialog1-cancel-button: container1-dialog1-cancel-button, dialog1-accept-button: container1-dialog1-accept-button, dialog2-content: container1-dialog2-content, dialog2-cancel-button: container1-dialog2-cancel-button, dialog2-accept-button: container1-dialog2-accept-button"></my-container>
        <my-container exportparts="container: container2-container, dialog1-content: container2-dialog1-content, dialog1-cancel-button: container2-dialog1-cancel-button, dialog1-accept-button: container2-dialog1-accept-button, dialog2-content: container2-dialog2-content, dialog2-cancel-button: container2-dialog2-cancel-button, dialog2-accept-button: container2-dialog2-accept-button"></my-container>
      </div>`;
  }

}

const shouldToggle = !!window.location.search.match('shouldToggle');

@customElement('my-stuff')
export class MyStuff extends PartStyledElement {

  @property({type: Boolean})
  special = true; //!(console as any).perfParams || (console as any).perfParams.toggle !== 'true';

  @property()
    _toggled = -1;

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 8px;
        padding: 8px;
        border: 1px solid green;
      }

      ${part('.special::part(view)', css`
        border: 1px dashed navy;
        margin: 4px;
        padding: 4px;
        color: navy;
      `)}

      ${part('.special::part(container1-container)', css`
        border: 1px solid red;
        margin: 4px;
        padding: 4px;
        color: red;
      `)}

      ${part('.special::part(container1-dialog1-content)', css`
        margin: 4px;
        padding: 4px;
        color: red;
        border: 1px solid red;
      `)}

      ${part('.special::part(container1-dialog1-accept-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: navy;
        color: red;
        border: 2px solid red;
      `)}

      ${part('.special::part(container1-dialog1-cancel-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: gray;
        color: red;
        border: 2px solid red;
      `)}

      ${part('.special::part(container1-dialog2-content)', css`
        margin: 4px;
        padding: 4px;
        color: red;
        border: 1px solid green;
      `)}

      ${part('.special::part(container1-dialog2-accept-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: navy;
        color: red;
        border: 2px solid green;
      `)}

      ${part('.special::part(container1-dialog2-cancel-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: gray;
        color: red;
        border: 2px solid green;
      `)}


      ${part('.special::part(container2-container)', css`
        border: 1px solid red;
        margin: 4px;
        padding: 4px;
        color: green;
      `)}

      ${part('.special::part(container2-dialog1-content)', css`
        margin: 4px;
        padding: 4px;
        color: green;
        border: 1px solid red;
      `)}

      ${part('.special::part(container2-dialog1-accept-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: navy;
        color: green;
        border: 2px solid red;
      `)}

      ${part('.special::part(container2-dialog1-cancel-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: gray;
        color: green;
        border: 2px solid red;
      `)}

      ${part('.special::part(container2-dialog2-content)', css`
        margin: 4px;
        padding: 4px;
        color: green;
        border: 1px solid green;
      `)}

      ${part('.special::part(container2-dialog2-accept-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: navy;
        color: green;
        border: 2px solid green;
      `)}

      ${part('.special::part(container2-dialog2-cancel-button)', css`
        margin: 4px;
        padding: 4px;
        background-color: gray;
        color: green;
        border: 2px solid green;
      `)}


    `;
  }

  async firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    if (shouldToggle) {
      while (this._toggled < 11) {
        this._toggled++;
        this.special = !this.special;
        //await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.updateComplete;
      }
    }
  }

  /*get cssPartNames() {
    if (!this._partNames) {
      this._partNames = new Set();
    }
    return this._partNames;
  }*/

  render() {
    const special = this.special;
    return html`
      <my-view id="view1" class=${classMap({special})}></my-view>
      <hr>
      <my-view id="view2" class=${classMap({special})}></my-view>`;
  }

}
