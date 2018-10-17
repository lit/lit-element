import { LitElement, html } from "../node_modules/@polymer/lit-element/lit-element.js";
import sdk from "../node_modules/@stackblitz/sdk/bundles/sdk.m.js";
import "./project-loader.js";

class StackBlitz extends LitElement {
  static get properties() {
    return {
      folder: {
        type: String
      },
      slot: {
        type: String
      },
      clickToLoad: {
        type: Boolean
      },
      forceEmbedLayout: {
        type: Boolean
      },
      view: {
        type: String
      },
      openFile: {
        type: String
      },
      height: {
        type: Number
      },
      options: {
        type: Object
      },
      project: {
        type: Object
      }
    };
  }

  render() {
    return html`
      <style>
        iframe {
          border: none;
          background-color: #333333
        }
      </style>
      ${this.slot == "embed" ? html`` : html`
        <project-loader 
          id="loader"
          @project-loaded="${e => this.embedProject(e.detail.project, this.options)}"
          folder="${this.folder}">
        </project-loader>`}
      <div id="stackblitz"></div>
    `;
  }

  firstUpdated() {
    this.options = Object.assign({}, this.options, {
      'clickToLoad': this.clickToLoad,
      'forceEmbedLayout': this.forceEmbedLayout,
      'view': this.view ? this.view : 'both',
      'openFile': this.openFile ? this.openFile : 'index.html',
      'height': this.height ? this.height : (window.innerHeight - 10) / 2
    });
    this.project = {};
  }

  embedProject(project, options) {
    var embedIn = this.shadowRoot.getElementById('stackblitz');
    const vm = sdk.embedProject(embedIn, project, options);
  }

}

customElements.define('stack-blitz', StackBlitz);