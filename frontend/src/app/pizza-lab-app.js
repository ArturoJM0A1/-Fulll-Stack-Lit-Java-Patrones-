import { LitElement, html, css } from 'lit';
import { api } from '../data/api-client.js'; import { appState$, publish } from './cells-compat.js';
import '../pages/menu-page.js'; import '../pages/orders-page.js'; import '../pages/sales-page.js'; import '../components/pizza-cart.js';
/** Raíz SPA: el hash evita recargas; RxJS sincroniza el carrito sin APIs CELLS ficticias. */
export class PizzaLabApp extends LitElement {
 static properties={route:{state:true},pizzas:{state:true},orders:{state:true},cart:{state:true},loading:{state:true},error:{state:true},submitting:{state:true},report:{state:true},reportDate:{state:true}};
 static styles=css`:host{display:block;max-width:960px;margin:auto;font-family:system-ui;padding:1rem}nav{display:flex;gap:1rem;margin-bottom:1rem}a{color:#8b1e1e}main{display:grid;grid-template-columns:2fr 1fr;gap:1rem}@media(max-width:700px){main{grid-template-columns:1fr}}`;
 constructor(){super();this.route='menu';this.pizzas=[];this.orders=[];this.cart=[];this.loading=false;this.error='';this.submitting=false;this.report=null;this.reportDate=new Date().toISOString().slice(0,10);this.subscription=null;this.onHash=()=>this.route=(location.hash.slice(1)||'menu');}
 connectedCallback(){super.connectedCallback();window.addEventListener('hashchange',this.onHash);this.onHash();this.subscription=appState$.subscribe(state=>this.cart=state.cart);this.loadMenu();}
 disconnectedCallback(){window.removeEventListener('hashchange',this.onHash);this.subscription?.unsubscribe();super.disconnectedCallback();}
 updated(changed){if(changed.has('route')&&this.route==='orders')this.loadOrders();}
 async loadMenu(){this.loading=true;this.error='';try{this.pizzas=await api.pizzas();await this.updateComplete;}catch(e){this.error=e.message;}finally{this.loading=false;}}
 async loadOrders(){this.loading=true;this.error='';try{this.orders=await api.orders();}catch(e){this.error=e.message;}finally{this.loading=false;}}
 addPizza(event){const pizza=event.detail.pizza;const found=this.cart.find(i=>i.id===pizza.id);const cart=found?this.cart.map(i=>i.id===pizza.id?{...i,quantity:i.quantity+1}:i):[...this.cart,{...pizza,quantity:1}];publish({cart});}
 updateCart(event,delta){const cart=this.cart.map(i=>i.id===event.detail.id?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0);publish({cart});}
 async checkout(){this.submitting=true;this.error='';try{await api.createOrder(this.cart.map(i=>({pizzaId:i.id,quantity:i.quantity})));publish({cart:[],refreshOrders:Date.now()});location.hash='orders';await this.loadOrders();}catch(e){this.error=e.message;}finally{this.submitting=false;}}
 async changeStatus(event){try{await api.changeStatus(event.detail.id,event.detail.status);await this.loadOrders();}catch(e){this.error=e.message;}}
 async makeReport(){this.loading=true;this.error='';try{this.report=await api.runReport(this.reportDate);}catch(e){this.error=e.message;}finally{this.loading=false;}}
 renderPage(){if(this.route==='orders')return html`<orders-page .orders=${this.orders} .loading=${this.loading} .error=${this.error}></orders-page>`;if(this.route==='sales')return html`<section><label>Fecha <input type="date" .value=${this.reportDate} @change=${e=>this.reportDate=e.target.value}/></label><button @click=${this.makeReport}>Generar reporte batch</button><sales-page .report=${this.report} .loading=${this.loading} .error=${this.error}><small slot="help">Procesa pedidos por chunks en el backend.</small></sales-page></section>`;return html`<menu-page .pizzas=${this.pizzas} .loading=${this.loading} .error=${this.error}></menu-page>`;}
 render(){return html`<nav><a href="#menu">Menú</a><a href="#orders">Pedidos</a><a href="#sales">Ventas</a></nav>${this.error&&this.route!=='menu'?html`<p role="alert">${this.error}</p>`:''}<main><section @add-pizza=${this.addPizza} @change-order-status=${this.changeStatus}>${this.renderPage()}</section><pizza-cart .items=${this.cart} .submitting=${this.submitting} @remove-pizza=${e=>this.updateCart(e,-1)} @increase-pizza=${e=>this.updateCart(e,1)} @checkout=${this.checkout}></pizza-cart></main>`;}
}
customElements.define('pizza-lab-app',PizzaLabApp);
