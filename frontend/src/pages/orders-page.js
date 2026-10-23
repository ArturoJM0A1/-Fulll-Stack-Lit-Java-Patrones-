import { LitElement, html } from 'lit'; import '../components/order-list.js';
/** Página de pedidos con una única responsabilidad de composición visual. */
export class OrdersPage extends LitElement { static properties={orders:{type:Array},loading:{type:Boolean},error:{type:String}};constructor(){super();this.orders=[];this.loading=false;this.error='';} render(){return html`<h1>Pedidos</h1><order-list title="Pedidos activos" .orders=${this.orders} .loading=${this.loading} .error=${this.error}></order-list>`;} }
customElements.define('orders-page',OrdersPage);
