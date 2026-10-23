/** Cliente REST único: AJAX es comunicación asíncrona; fetch es la API moderna empleada aquí. */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
export class ApiClient {
  async request(path, options = {}) {
    let response;
    try { response = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options }); }
    catch { throw new Error('No se pudo conectar con el servidor de PizzaLab.'); }
    const body = await response.text(); let data = null;
    try { data = body ? JSON.parse(body) : null; } catch { throw new Error('El servidor devolvió JSON inválido.'); }
    if (!response.ok) throw new Error(data?.error ?? `Error HTTP ${response.status}`);
    return data;
  }
  pizzas() { return this.request('/pizzas'); }
  orders() { return this.request('/orders'); }
  createOrder(items) { return this.request('/orders', { method: 'POST', body: JSON.stringify({ items }) }); }
  changeStatus(id, status) { return this.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
  runReport(date) { return this.request(`/batch/sales-report?date=${encodeURIComponent(date)}`, { method: 'POST' }); }
  report(date) { return this.request(`/reports/sales?date=${encodeURIComponent(date)}`); }
}
export const api = new ApiClient();
