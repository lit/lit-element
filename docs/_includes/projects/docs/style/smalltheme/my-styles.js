import { html } from '@polymer/lit-element'; 

export const navStyles = html`
  ul {
    list-style-type: none; 
    margin: 0;
    padding: 0;
  }
  .navigation {
    display: flex;
    flex-direction: row;
  }
  .item {
    padding: 8px;
  }
`;
