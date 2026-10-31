# Dashboard Angular de ventas

Aplicación standalone del módulo de análisis de PizzaLab, independiente de Lit.

```powershell
npm install
npm start
```

El backend Spring Boot debe estar activo en `http://localhost:8080`; Angular consulta `/api/orders`, `/api/analytics/sales` y los endpoints de reportes. La configuración de producción usa `/api` en el mismo origen.

Para build y pruebas unitarias:

```powershell
npm run build
npm test -- --watch=false
```

La explicación de los 13 conceptos estudiados está en el README de la raíz del repositorio.
