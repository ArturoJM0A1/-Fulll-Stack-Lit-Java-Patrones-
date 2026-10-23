import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
/** Menú encapsulado en Shadow DOM; recibe pizzas como propiedad (arrays no caben en atributos HTML). */
export class PizzaMenu extends LitElement {
  static properties = { pizzas: { type: Array }, loading: { type: Boolean }, error: { type: String } };
  static styles = css`:host{display:block}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem}.card{border:1px solid #ddd;padding:1rem;border-radius:.5rem}button{cursor:pointer}`;
  constructor(){ super(); this.pizzas=[]; this.loading=false; this.error=''; }
  add(pizza){ this.dispatchEvent(new CustomEvent('add-pizza',{ detail:{ pizza }, bubbles:true, composed:true })); }
  render(){ if(this.loading)return html`<p aria-live="polite">Cargando menú…</p>`; if(this.error)return html`<p role="alert">${this.error}</p>`; if(!this.pizzas.length)return html`<p>No hay pizzas disponibles.</p>`; return html`<section class="grid">${repeat(this.pizzas,p=>p.id,p=>html`<article class="card"><h3>${p.name}</h3><p>${p.description}</p><strong>$${(p.priceCents/100).toFixed(2)}</strong><p><button @click=${()=>this.add(p)}>Añadir</button></p></article>`)}</section>`; }
}
customElements.define('pizza-menu', PizzaMenu);
