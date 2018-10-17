import { LitElement, html } from '@polymer/lit-element';

class StudentRec extends LitElement {  
  static get properties(){
    return { 
      student: Object
    }
  }
  constructor(){
    super();
    this.student = {};
  }
  _render({student}){
    return html`
      <div>
        ${student.id}<br/>
        ${student.name}<br/>
      </div>
    `;
  }
}

customElements.define('student-rec', StudentRec);
