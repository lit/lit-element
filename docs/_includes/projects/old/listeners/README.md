
To bind a lit-element property to the attribute of another element: 

```html
<element attr$=${myProp}></element>
```

**custom-element.js**

```js
class CustomElement extends LitElement {  
  static get properties(){
    return {
      myStyle: String
    };
  }
  constructor(){
    super();
    this.myStyle = '';
  }
  _render({myStyle}){
    return html`
      <style>
        .red { color: red; }
        .blue { color: blue; }
      </style>
      
      <p>lit-element is <span class$="${myStyle}">rad</span> :)</p>
    `;
  }
}
```

**index.html**

```html
<custom-element myStyle="red"></custom-element>
<custom-element myStyle="blue"></custom-element>
```
