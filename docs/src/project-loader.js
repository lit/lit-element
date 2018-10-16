import { LitElement, html } from '@polymer/lit-element';

export class ProjectLoader extends LitElement {
  static get properties(){
    return {
      folder: { type: String },
      project: { type: Object }
    };
  }
  
  render(){
    return html``;
  }

  firstUpdated(){
    this.project={};
    this.loadProject();
  }
  
  loadProject(){
    if(this.folder=='undefined'){
      console.log("Missing folder property.");
      return;
    } else console.log('loading', this.folder);
    fetch(`${this.folder}/manifest.json`)
    .then(response => { return response.json() })
    .then(manifest => {      
      return this.getFiles(manifest).then(filesArray => {
        var filesObject = filesArray.reduce((prev, curr) => {
          return Object.assign({}, prev, curr);
        });
        this.project = Object.assign({}, manifest, { files: filesObject });
        var projectLoadedEvent = new CustomEvent('project-loaded', { 
          detail: { project: this.project },
          bubbles: true
        });
        return projectLoadedEvent;
      }).then((projectLoadedEvent) => { 
        this.dispatchEvent(projectLoadedEvent); 
      }).catch((error) => {console.log(error)});
    }).catch((error) => {console.log(error)});
  }
  getFiles(manifest){
    return Promise.all(manifest.files.map(filename => { return (
      fetch(`${this.folder}/${filename}`)
      .then(result => {
        return result.text().then(r => { 
          return { [filename]: this.uglyHack(r) }
        }).catch((error) => {console.log(error)});
      })
    )})).catch((error) => {console.log(error)});
  }
  uglyHack(r){
    var regex = /\.\.\//g;
    return (r.replace("../node_modules/", "").replace(regex, ""));
  }
};

customElements.define('project-loader', ProjectLoader);
