import { BehaviorSubject } from 'rxjs';
/**
 * Adaptador local documentado: CELLS público no se encontró en npm (22-10-2026).
 * Ofrece sólo streams RxJS reales para la SPA; no suplanta startApp, mainNode ni controladores CELLS.
 */
export const appState$ = new BehaviorSubject({ cart: [], refreshOrders: 0 });
export function publish(patch) { appState$.next({ ...appState$.value, ...patch }); }
/** Inicialización propia de Vite/Lit, deliberadamente distinta de una API CELLS inexistente. */
export function startPizzaLab() { return document.querySelector('pizza-lab-app'); }
