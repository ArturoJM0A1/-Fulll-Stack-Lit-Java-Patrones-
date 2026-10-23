import { LitElement, html } from 'lit';
import '../components/pizza-menu.js';
/** Página Web Component de menú: composición simple, los datos siguen siendo propiedad reactiva. */
export class MenuPage extends LitElement { static properties={pizzas:{type:Array},loading:{type:Boolean},error:{type:String}};constructor(){super();this.pizzas=[];this.loading=false;this.error='';} render(){return html`<h1>Menú</h1><pizza-menu .pizzas=${this.pizzas} .loading=${this.loading} .error=${this.error}></pizza-menu>`;} }
customElements.define('menu-page',MenuPage);
