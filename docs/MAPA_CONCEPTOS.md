# Mapa verificable de conceptos

Las rutas son relativas a la raíz. «Verificar» indica código ejecutable o una interacción concreta. No se atribuyen APIs CELLS no disponibles.

## LitElement (15/15)

| # | Aplicación real | Verificar |
|---|---|---|
|1–2 Web/Custom Elements|`pizza-menu`, `pizza-cart`, `order-list`, páginas y `pizza-lab-app`|Abrir DevTools y consultar `customElements.get('pizza-menu')`|
|3 render/html|Todos los `render()` en `frontend/src/components`|`npm run build`|
|4 propiedades reactivas|`static properties` de los componentes|Añadir pizza actualiza la vista|
|5 @state|`PizzaLabApp` declara campos internos con `{state:true}`|Cambiar ruta/carga muestra cambios|
|6 atributo vs propiedad|`title` atributo y `.orders`/`.pizzas` propiedades en páginas|Inspeccionar `orders-page`|
|7 ciclo update|`await this.updateComplete` en `loadMenu`|Carga de menú sin `requestUpdate` manual|
|8 ciclo vida|`connectedCallback`/`disconnectedCallback` raíz|Navegar/retirar raíz libera listener y suscripción|
|9–10 estilos/Shadow DOM|`static styles` de componentes|Estilos encapsulados dentro de cada shadow root|
|11 eventos|`@click`, `@change` declarativos|Botones de añadir/cantidad|
|12 CustomEvent|`add-pizza`, `checkout`, `change-order-status` con detail/bubbles/composed|Crear pedido/cambiar estado|
|13 condicional|Estados loading/error/vacío en menú, pedidos y ventas|Parar API o consultar lista vacía|
|14 listas|`repeat(..., key, template)` en menú/carrito/pedidos|Varios productos conservan claves estables|
|15 composición/slots|Páginas contienen componentes; `sales-page` usa slot `help`|Ir a Ventas|

## CELLS / Open Cells

| # | Estado honesto y evidencia | Verificar |
|---|---|---|
|1 arquitectura|Compatible: `app/`, `pages/`, `components/`, `data/`; no runtime CELLS público|Ver `cells-compat.js`|
|2 SPA|Hash routing sin recarga|Cambiar Menú/Pedidos/Ventas|
|3 páginas WC|`menu-page`, `orders-page`, `sales-page`|`npm run build`|
|4 Core|**No implementable**: `@cells/cells-core` devolvió npm 404|Ver README|
|5 startApp/mainNode|**No implementable**; `startPizzaLab()` es propio y no se llama CELLS|Ver comentario en `cells-compat.js`|
|6 rutas|Hash `#menu`, `#orders`, `#sales`|Navegación SPA|
|7 navegación/parámetros|La API valida `/{id}`; UI navega rutas de vista sin parámetros ficticios|`GET /api/orders/1`|
|8 ElementController|**No disponible públicamente**, no simulado|README|
|9 PageController|**No disponible públicamente**, no simulado|README|
|10 RxJS|`BehaviorSubject` `appState$`|Añadir pizza sincroniza carrito|
|11 publish|`publish()` llama `BehaviorSubject.next`|`addPizza`|
|12 subscribe|`connectedCallback` se suscribe al stream|Recargar SPA|
|13 unsubscribe|`disconnectedCallback` libera suscripción|Código raíz|
|14 hooks página|**No declarados**: no hay API CELLS verificable|README|
|15 Data Manager REST|`data/api-client.js`, fetch/async/errores; ASO interno no se finge|Prueba Vitest y operaciones UI|

## Java (20/20)

| # | Aplicación | Verificar |
|---|---|---|
|1 JDK/JRE/JVM|README exige JDK 21|`mvn package`|
|2 tipos/null|`Pizza`, DTOs y `Optional` de DAO|tests de servicio|
|3 clases/constructores|`Pizza`, `Order`, `OrderLine`|Crear pedido|
|4 encapsulamiento|campos `private final`, getters controlados|`Pizza.java`|
|5 herencia|`TextReportFormatter extends ReportFormatter`|Batch formatea estrategia disponible|
|6 polimorfismo|`PromotionStrategy`/`NoPromotionStrategy`|`OrderService` inyecta interfaz|
|7 abstracción/interfaces|repositorios, formatter abstracto|compilación|
|8 sobrecarga/sobrescritura|constructor sobrecargado `OrderLine(Pizza,int)`; `format()` sobrescrito|`OrderLine`, `TextReportFormatter`|
|9 static/final|`static final LOG`; modelos inmutables|`OrderAuditListener`|
|10 String/StringBuilder|`TextReportFormatter`|código y batch|
|11 excepciones/recursos|Advice HTTP; `SqliteVerifier` try-with-resources|arranque backend|
|12 colecciones|`List` líneas, `Set` ids, `Map` cantidades/estados|`OrderService`, batch|
|13 genéricos|`List<OrderLine>`, `Map<String,Integer>`|compilación|
|14 equals/hashCode|`Pizza` compara por id|`Pizza.java`|
|15 lambdas/streams|mapeos `stream()` y filtro por fecha|GET pedidos/batch|
|16 concurrencia|beans sin estado mutable; Writer `@JobScope`|`ReportCollector`|
|17 JDBC/SQL/transacción|DAOs JdbcTemplate, `@Transactional`, SQLite|prueba integración|
|18 REST/HTTP/JSON|Controllers/DTOs/validación|`docs/pizzalab.http`|
|19 DI/capas|constructores Spring y paquetes|`mvn test`|
|20 Batch|Job/Step/Reader/Processor/Writer|POST batch y pruebas|

Las pruebas automatizadas cubren regla de total, transición inválida, HTTP+SQLite, lote normal y lote vacío. El 404 de un reporte ausente prueba un error recuperable del flujo de consulta.
