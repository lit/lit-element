import { LitElement, html, customElement, property } from 'lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({type : String})  prop1 = 'Hello World';
  @property({type : Number})  prop2 = 5;
  @property({type : Boolean}) prop3 = true;
  @property({type : Array})   prop4 = [1,2,3];
  @property({type : Object})  prop5 = { subprop1: 'prop 5 subprop1 value' };

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>
      <p>prop3: ${this.prop3}</p>
      <p>prop4[0]:</p>${this.prop4[0]}</p>
      <p>prop5.subprop1: ${this.prop5.subprop1}</p>
    `;
  }
}
customElements.define('my-element', MyElement);
