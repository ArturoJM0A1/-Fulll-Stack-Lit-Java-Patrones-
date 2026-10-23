import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
/** Carrito: emite intenciones y no decide precios ni totales definitivos, que pertenecen al backend. */
export class PizzaCart extends LitElement {
  static properties={ items:{type:Array}, submitting:{type:Boolean} }; static styles=css`:host{display:block;border:1px solid #ddd;padding:1rem;border-radius:.5rem}button{margin:.15rem}`;
  constructor(){super();this.items=[];this.submitting=false;}
  emit(type,id){this.dispatchEvent(new CustomEvent(type,{detail:{id},bubbles:true,composed:true}));}
  render(){const estimate=this.items.reduce((sum,item)=>sum+item.priceCents*item.quantity,0);return html`<section><h2>Carrito</h2>${!this.items.length?html`<p>Tu carrito está vacío.</p>`:html`${repeat(this.items,i=>i.id,i=>html`<div>${i.name} × ${i.quantity} <button @click=${()=>this.emit('remove-pizza',i.id)}>Quitar</button><button @click=${()=>this.emit('increase-pizza',i.id)}>+</button></div>`)}<p>Estimado: $${(estimate/100).toFixed(2)} <small>El servidor recalcula el total.</small></p><button ?disabled=${!this.items.length||this.submitting} @click=${()=>this.emit('checkout',0)}>${this.submitting?'Creando…':'Crear pedido'}</button>`}</section>`;}
}
customElements.define('pizza-cart', PizzaCart);
