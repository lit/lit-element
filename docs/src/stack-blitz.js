import { LitElement, html } from '@polymer/lit-element';
import StackBlitzSDK from '@stackblitz/sdk';

class StackBlitz extends LitElement {
  static get properties() {
    return {
      folder: { type: String },
      openFile: { type: String },
    };
  }

  constructor() {
    super();
    this.openFile = 'index.html';
  }

  render() {
    return html`
      <style>
        .pretty-button {
          display: inline-block;
          box-sizing: border-box;
          margin: 0 4px;
          padding: 8px 44px;
          border: 2px solid #000;
          background-color: transparent;
          font-size: 14px;
          font-weight: 500;
          color: inherit;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          border-radius: 0;
          -webkit-appearance: none;
          appearance: none;
        }

        .pretty-button:active {
          background-color: #333;
          color: #FFF;
        }

        .pretty-button:hover {
          text-decoration: none !important;
          background-color: #333;
          color: #FFF;
        }

        /* iframe#container will replace div#container once StackBlitz loads. */
        iframe {
          border: none;
          min-height: 50vh;
        }
      </style>
      <div id="container">
        <button class="pretty-button" @click="${this.loadProject}">
          Launch Code Editor
        </button>
      </div>`;
  }
  
  async loadProject() {
    const folder = this.folder;
    if (folder) {
      const response = await fetch(`${folder}/manifest.json`);
      const manifest = await response.json();
      const files = manifest.files.map(async (filename) => {
        const response = await fetch(`${folder}/${filename}`);
        return { [filename]: await response.text() };
      });
      const project = Object.assign({}, manifest, {
        files: (await Promise.all(files)).reduce(
          (acc, file) => Object.assign(acc, file), {})
      });
      const container = this.shadowRoot.getElementById('container');
      return StackBlitzSDK.embedProject(container, project, {
        forceEmbedLayout: true,
        view: 'editor',
        openFile: this.openFile
      });
    }
  }
}

customElements.define('stack-blitz', StackBlitz);
