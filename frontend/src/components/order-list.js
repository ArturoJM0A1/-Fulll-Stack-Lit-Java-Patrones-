import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
/** Lista de pedidos; el atributo title demuestra paso de texto y orders es una propiedad compleja. */
export class OrderList extends LitElement {
 static properties={orders:{type:Array},loading:{type:Boolean},error:{type:String}};static styles=css`:host{display:block}article{border-bottom:1px solid #ddd;padding:.75rem 0}button{margin-left:.5rem}`;
 constructor(){super();this.orders=[];this.loading=false;this.error='';}
 next(status){return {RECIBIDO:'EN_PREPARACION',EN_PREPARACION:'LISTO',LISTO:'ENTREGADO'}[status];}
 change(order){this.dispatchEvent(new CustomEvent('change-order-status',{detail:{id:order.id,status:this.next(order.status)},bubbles:true,composed:true}));}
 render(){if(this.loading)return html`<p>Cargando pedidos…</p>`;if(this.error)return html`<p role="alert">${this.error}</p>`;if(!this.orders.length)return html`<p>Aún no hay pedidos.</p>`;return html`${repeat(this.orders,o=>o.id,o=>html`<article><strong>#${o.id} — ${o.status}</strong> — $${(o.totalCents/100).toFixed(2)}<br/>${o.lines.map(l=>html`<span>${l.pizzaName} × ${l.quantity} </span>`)}${this.next(o.status)?html`<button @click=${()=>this.change(o)}>Pasar a ${this.next(o.status)}</button>`:''}</article>`)}`;}
}
customElements.define('order-list',OrderList);
