import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from './api-url.token';
import { apiErrorInterceptor } from './api-error.interceptor';
import { AnalyticsDataService } from './analytics-data.service';
import { AnalyticsViewState } from '../shared/models/sales.models';

describe('AnalyticsDataService', () => {
  let service: AnalyticsDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsDataService,
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:8080/api' }
      ]
    });
    service = TestBed.inject(AnalyticsDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify({ ignoreCancelled: true }));

  it('combina estadísticas y pedidos reales para el mismo intervalo', () => {
    const states: AnalyticsViewState[] = [];
    const subscription = service.state$.subscribe((state) => states.push(state));
    const range = service.currentRange;

    const analyticsRequest = http.expectOne(
      (request) =>
        request.url === 'http://localhost:8080/api/analytics/sales' &&
        request.params.get('from') === range.from &&
        request.params.get('to') === range.to
    );
    const ordersRequest = http.expectOne('http://localhost:8080/api/orders');
    expect(states[0]?.status).toBe('loading');

    ordersRequest.flush([]);
    analyticsRequest.flush({
      from: range.from,
      to: range.to,
      totalRevenueCents: 0,
      orderCount: 0,
      averageOrderCents: 0,
      bestSellingProduct: null,
      totalDiscountCents: 0,
      daily: [],
      products: [],
      statuses: {}
    });

    expect(states.at(-1)?.status).toBe('success');
    subscription.unsubscribe();
  });

  it('expone errores HTTP normalizados en el estado para que la vista los muestre', () => {
    const states: AnalyticsViewState[] = [];
    const subscription = service.state$.subscribe((state) => states.push(state));
    const analyticsRequest = http.expectOne('http://localhost:8080/api/analytics/sales?from=' + service.currentRange.from + '&to=' + service.currentRange.to);
    http.expectOne('http://localhost:8080/api/orders').flush([]);

    analyticsRequest.flush({ error: 'API fuera de servicio' }, { status: 503, statusText: 'Unavailable' });

    const lastState = states.at(-1);
    expect(lastState?.status).toBe('error');
    if (lastState?.status === 'error') expect(lastState.message).toBe('API fuera de servicio');
    subscription.unsubscribe();
  });

  it('cancela solicitudes anteriores cuando cambia el intervalo', () => {
    const subscription = service.state$.subscribe();
    const original = service.currentRange;
    const staleAnalytics = http.expectOne((request) => request.url.endsWith('/analytics/sales'));
    const staleOrders = http.expectOne('http://localhost:8080/api/orders');

    service.setRange({ from: '2026-10-01', to: '2026-10-15' });
    expect(staleAnalytics.cancelled).toBeTrue();
    expect(staleOrders.cancelled).toBeTrue();
    http.expectOne((request) => request.url.endsWith('/analytics/sales') && request.params.get('from') === '2026-10-01').flush({
      from: '2026-10-01', to: '2026-10-15', totalRevenueCents: 0, orderCount: 0,
      averageOrderCents: 0, bestSellingProduct: null, totalDiscountCents: 0,
      daily: [], products: [], statuses: {}
    });
    http.expectOne('http://localhost:8080/api/orders').flush([]);
    expect(original.from).not.toBe('2026-10-01');
    subscription.unsubscribe();
  });

  it('recarga el mismo intervalo al emitir la acción explícita de actualizar', () => {
    const subscription = service.state$.subscribe();
    const range = service.currentRange;
    http.expectOne((request) => request.url.endsWith('/analytics/sales')).flush({
      from: range.from, to: range.to, totalRevenueCents: 0, orderCount: 0,
      averageOrderCents: 0, bestSellingProduct: null, totalDiscountCents: 0,
      daily: [], products: [], statuses: {}
    });
    http.expectOne('http://localhost:8080/api/orders').flush([]);

    service.refresh();

    const analyticsRequest = http.expectOne((request) => request.url.endsWith('/analytics/sales'));
    expect(analyticsRequest.request.params.get('from')).toBe(range.from);
    analyticsRequest.flush({
      from: range.from, to: range.to, totalRevenueCents: 0, orderCount: 0,
      averageOrderCents: 0, bestSellingProduct: null, totalDiscountCents: 0,
      daily: [], products: [], statuses: {}
    });
    http.expectOne('http://localhost:8080/api/orders').flush([]);
    subscription.unsubscribe();
  });
});
