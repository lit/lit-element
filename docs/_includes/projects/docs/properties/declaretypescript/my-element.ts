import { LitElement, html, customElement, property } from '@polymer/lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({type : String})  prop1 = 'Hello World';
  @property({type : Number})  prop2 = 5;
  @property({type : Boolean}) prop3 = true;

  render() {
    return html`
      <p>${this.prop1}</p>
      <p>${this.prop2}</p>
      <p>${this.prop3}</p>
    `;
  }
}
customElements.define('my-element', MyElement);
