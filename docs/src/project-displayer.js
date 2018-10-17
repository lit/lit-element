import {LitElement, html} from '@polymer/lit-element';
import './project-loader.js';

class ProjectDisplayer extends LitElement {
  static get properties() {
    return {
      folder: { type: String },

      clickToLoad: { type: Boolean },
      forceEmbedLayout: { type: Boolean },
      view: { type: String },
      openFile: { type: String },
      height: { type: Number },

      options: { type: Object },
      project: { type: Object }
    };
  }

  constructor() {
    super();
    this.project = {};
  }
  render() {
    return html`
      <style>
        :host { 
          min-height: 50vh; 
        }
      </style>
      <project-loader id="loader"
        @project-loaded="${(e) => this.displayProject(e.detail.project)}"
        folder="${this.folder}">
      </project-loader>
      <div id="dynamicsample">
        <slot id="slot" name="embed"></slot>
      </div>
    `;
  }
  firstUpdated() {
    this.options = Object.assign({}, this.options, {
      'clickToLoad': this.clickToLoad,
      'forceEmbedLayout': this.forceEmbedLayout,
      'view': this.view ? this.view : 'both',
      'openFile': this.openFile ? this.openFile : 'index.html',
      'height': this.height ? this.height : (window.innerHeight-10)/2
    });
  }
  displayProject(project) {
    this.project = Object.assign({}, project);
    this.requestUpdate();
    this.embedProject(project);
  }
  async embedProject(project) {
    var slot = this.shadowRoot.getElementById("slot");
    var embed = slot.assignedNodes()[0];
    if (embed.tagName == 'STACK-BLITZ') {
      return embed.embedProject(project, this.options);
    } else console.log('Put <stack-blitz slot="embed"></stack-blitz> in light DOM to embed a code sample.')
  }
}

customElements.define('project-displayer', ProjectDisplayer);
