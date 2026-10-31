## Ejecutar el frontend Lit

Inicia el backend en una terminal:

```powershell
D:\AJM\tools\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

Inicia el frontend en otra terminal:

```powershell
npm install
npm run dev
```

http://127.0.0.1:5173.

## Dashboard Angular de ventas

El dashboard administrativo es una aplicación independiente en `angular-dashboard/`; no sustituye ni modifica la aplicación Lit de `frontend/`. Arranca el backend Spring Boot en el puerto `8080`, y luego, desde la carpeta Angular:

```powershell
cd angular-dashboard
npm install
npm start
```

Abre http://localhost:4200. La API de desarrollo usa `http://localhost:8080/api` (`src/environments/environment.ts`); la compilación de producción cambia el token a `/api` mediante `src/environments/environment.prod.ts`. El backend admite ambos orígenes Angular locales sin quitar los orígenes de Lit.

`GET /api/analytics/sales?from=YYYY-MM-DD&to=YYYY-MM-DD` calcula los agregados en Spring a partir de pedidos y líneas persistidos. Los descuentos se derivan de la diferencia entre el subtotal de las líneas históricas y el total del pedido; con la estrategia de promociones actual, normalmente serán cero. `POST /api/batch/sales-report/range?from=...&to=...` ejecuta el Job existente para cada día y devuelve el resultado persistido. La pantalla Reportes también permite consultar un reporte diario guardado mediante el endpoint existente `GET /api/reports/sales?date=...`.

### Conceptos Angular y RxJS

Los 13 conceptos se materializan en código ejecutable; los comentarios técnicos del flujo RxJS están en español.

| Concepto | Implementación y funcionamiento |
|---|---|
| 1. Componentes standalone | `src/app/app.ts`, `src/app/shared/components/chart-card.component.ts` y las tres páginas de `src/app/features/`; cada vista declara sus dependencias y puede cargarse sin un NgModule. |
| 2. Templates y data binding | `src/app/features/dashboard/dashboard-page.component.html`, `products-page.component.html` y `reports-page.component.html` conectan propiedades, eventos, formularios y gráficas a los datos del backend. |
| 3. Control flow `@if`, `@for`, `@switch` | Los templates de dashboard, productos y reportes alternan carga/error/vacío/éxito con `@switch`, prueban estados con `@if` y recorren filas con `@for`. |
| 4. Signals y `computed` | `dashboard-page.component.ts`, `products-page.component.ts` y `reports-page.component.ts` convierten flujos a signals con `toSignal`; `computed` deriva KPI, datasets, productos buscados y totales. |
| 5. Angular Router | `src/app/app.routes.ts` define resumen, productos y reportes con carga perezosa; `src/app/app.html` contiene navegación y `RouterOutlet`. |
| 6. Reactive Forms | Las páginas de dashboard y reportes usan formularios tipados para fechas; el resumen también filtra pedidos por ID/nombre. Debouncea cambios y no envía intervalos inválidos. |
| 7. HttpClient | `src/app/core/orders-api.service.ts`, `sales-analytics-api.service.ts` y `sales-report-api.service.ts` encapsulan GET de pedidos/estadísticas/reportes y POST de ejecución batch. |
| 8. HTTP Interceptors | `src/app/core/api-error.interceptor.ts`, registrado en `src/app/app.config.ts`, normaliza errores de conectividad y el contrato `{error}` de Spring. |
| 9. Pipes | `src/app/shared/pipes/cents-currency.pipe.ts` transforma céntimos a MXN; `statistic-percent.pipe.ts` presenta porcentajes; `DatePipe` muestra las fechas en español. |
| 10. Lifecycle hooks | `dashboard-page.component.ts` implementa `OnInit`; `takeUntilDestroyed` cierra el flujo del formulario al destruir la vista. `toSignal` gestiona la suscripción de estado según el ciclo de vida. |
| 11. Pruebas unitarias oficiales | `src/app/core/analytics-data.service.spec.ts` usa `HttpTestingController` para peticiones, errores HTTP y cancelación del intervalo anterior; las pruebas del preparador de gráficas y del pipe están junto a sus clases. Ejecuta `npm test`. |
| 12. RxJS | `src/app/core/analytics-data.service.ts` comparte el filtro con `BehaviorSubject`, notifica recargas con `Subject` y combina filtro/recarga con `combineLatest`. Usa `filter`, `distinctUntilChanged`, `switchMap` (cancela solicitudes antiguas), `forkJoin`, `map`, `catchError`, `startWith` y `shareReplay`. Los campos de fecha usan `debounceTime`; el batch usa `exhaustMap` para impedir ejecuciones duplicadas. |
| 13. Inyección de dependencias | `src/app/core/api-url.token.ts` define `API_BASE_URL`; `app.config.ts` registra HTTP, interceptor y URL, mientras `dashboard-page.component.ts` limita los providers de Chart.js a la ruta lazy. Los servicios/componentes usan `inject()` explícitamente. |

El adaptador del dashboard comparte `/api/orders` y la analítica agregada: las reglas y cálculos estadísticos viven en Java, mientras `src/app/shared/sales-chart-data.service.ts` transforma el DTO en series Chart.js independientes de la representación. Las cuatro gráficas muestran ingresos diarios, unidades por producto, pedidos por estado y comparación diaria de ingresos/descuentos.

Validación local:

```powershell
cd angular-dashboard
npm test -- --watch=false
npm run build
```

En `backend/`, ejecuta `mvn test` para verificar el agregado, los endpoints HTTP, SQLite y Spring Batch. Las pruebas Angular usan el backend HTTP de pruebas de Angular; una compilación y tests locales no equivalen a una verificación E2E entre navegador y una instancia Spring Boot desplegada.
