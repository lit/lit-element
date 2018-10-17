import { LitElement, html } from '@polymer/lit-element';

export class ProjectLoader extends LitElement {
  static get properties() {
    return {
      folder: { type: String },
      project: { type: Object }
    };
  }
  
  render() {
    return html``;
  }

  firstUpdated() {
    this.project = {};
    this.loadProject();
  }

  async loadProject() {
    if (this.folder == undefined) {
      console.log('Missing folder property.');
      return;
    } else {
      console.log('loading', this.folder);
    }

    try {
      const response = await fetch(`${this.folder}/manifest.json`);
      const manifest = await response.json();
      const filesArray = await this.getFiles(manifest);
      const filesObject = filesArray.reduce((prev, curr) => {
        return Object.assign({}, prev, curr);
      });

      this.project = Object.assign({}, manifest, {files: filesObject});
      const projectLoadedEvent = new CustomEvent('project-loaded', {
        detail: {project: this.project},
        bubbles: true
      });
      this.dispatchEvent(projectLoadedEvent);
    } catch (error) {
      console.log(error);
    }
  }

  async getFiles(manifest) {
    return Promise.all(manifest.files.map(async (filename) => {
      const response = await fetch(`${this.folder}/${filename}`);
      const text = await response.text();
      return {
        [filename]: this.uglyHack(text)
      };
    }));
  }

  uglyHack(r) {
    const regex = /\.\.\//g;
    return (r.replace('../node_modules/', '').replace(regex, ''));
  }
}
customElements.define('project-loader', ProjectLoader);
