import './student-rec.js';

import {html, LitElement} from '@polymer/lit-element';

class MainApp extends LitElement {
  _render({}) {
    return html`
      <student-rec></student-rec>
    `;
  }
  _firstRendered() {
    const studentRec = this.shadowRoot.querySelector('student-rec');
    studentRec.student = {id : '12345', name : 'Yasmeen'};
  }
}

customElements.define('main-app', MainApp);
