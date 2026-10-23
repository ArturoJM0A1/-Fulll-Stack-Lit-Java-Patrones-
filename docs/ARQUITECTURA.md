# Arquitectura

```text
Lit Web Component / página SPA
  → ApiClient (fetch + JSON + errores)
  → Controller REST
  → Service / Facade (@Transactional)
  → Repository / DAO JDBC parametrizado
  → SQLite: pizzas, orders, order_lines, sales_reports

POST /batch/sales-report
  → SalesReportService → Job Spring Batch
  → ListItemReader(pedidos por fecha) → Processor(valida) → ReportCollector Writer (chunks de 2)
  → sales_reports → GET /reports/sales
```

La petición REST es síncrona y trata un pedido de usuario; el batch recorre un conjunto por fecha, con Reader/Processor/Writer y resultado visible. Se usa `ResourcelessJobRepository` porque el estado operativo se devuelve sincrónicamente; el artefacto de negocio queda persistido en SQLite. Un fallo no llama al `afterJob` de éxito y por tanto no marca un reporte parcial como completado.

| Patrón | Problema y clase | Por qué aquí |
|---|---|---|
| DAO/Repository | Aísla SQLite en `Jdbc*Repository` | Evita SQL repartido por controllers; facilita probar servicios. |
| DI | Constructores de controllers/services | Dependencias explícitas y sustituibles, frente a `new` acoplados. |
| Strategy | `PromotionStrategy` | Permite añadir una promoción sin condicionales crecientes en pedidos. |
| Factory Method | `ReportFormatterFactory` | Centraliza la selección de formato ante futuras salidas, en vez de dispersar `if`. |
| Observer | `OrderEventListener`/`OrderAuditListener` | El registro reacciona a un cambio sin que `OrderService` conozca su implementación. |
| Facade | `OrderService`, `SalesReportService` | Da a HTTP una operación simple que coordina varios DAOs/reglas. |
| Builder | `JobParametersBuilder` | Construye parámetros del Job legiblemente; no añade Builder artificial al modelo simple. |
| Singleton de contenedor | beans Spring | Se documenta el singleton de Spring, sin un Singleton manual inseguro. |

No se introduce Decorator/Proxy porque no aporta una necesidad de dominio; Spring ya usa proxies para `@Transactional`. Los beans singleton no tienen estado mutable por petición; `ReportCollector` es `@JobScope`.
