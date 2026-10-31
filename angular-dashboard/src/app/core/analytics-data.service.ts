import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { OrdersApiService } from './orders-api.service';
import { SalesAnalyticsApiService } from './sales-analytics-api.service';
import { ApiRequestError } from './api-error.interceptor';
import { AnalyticsViewState, DateRange } from '../shared/models/sales.models';

/** Estado de filtros compartido entre resumen y análisis de productos. */
@Injectable({ providedIn: 'root' })
export class AnalyticsDataService {
  private readonly analyticsApi = inject(SalesAnalyticsApiService);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly rangeSubject = new BehaviorSubject<DateRange>(initialRange());
  private readonly refreshSubject = new Subject<void>();

  readonly range$ = this.rangeSubject.asObservable().pipe(
    // filter protege a las APIs si un consumidor intenta publicar un intervalo incompleto.
    filter((range) => Boolean(range.from && range.to && range.from <= range.to)),
    distinctUntilChanged((previous, current) => previous.from === current.from && previous.to === current.to)
  );
  readonly state$: Observable<AnalyticsViewState> = combineLatest([
    this.range$,
    // Subject expresa una recarga puntual sin duplicar ni reconstruir los filtros actuales.
    this.refreshSubject.pipe(startWith(undefined))
  ]).pipe(
    map(([range]) => range),
    // switchMap cancela el intervalo anterior si llega uno nuevo, evitando respuestas obsoletas.
    switchMap((range): Observable<AnalyticsViewState> =>
      forkJoin({
        analytics: this.analyticsApi.getSales(range),
        orders: this.ordersApi.list()
      }).pipe(
        map(({ analytics, orders }) => ({ status: 'success' as const, range, analytics, orders })),
        startWith({ status: 'loading' as const, range }),
        catchError((error: unknown) =>
          of({
            status: 'error' as const,
            range,
            message: error instanceof ApiRequestError ? error.message : 'No fue posible cargar las ventas.'
          })
        )
      )
    ),
    // shareReplay comparte la solicitud entre dashboard/productos y conserva la última vista activa.
    shareReplay({ bufferSize: 1, refCount: true })
  );

  setRange(range: DateRange): void {
    this.rangeSubject.next(range);
  }

  refresh(): void {
    this.refreshSubject.next();
  }

  get currentRange(): DateRange {
    return this.rangeSubject.value;
  }
}

function initialRange(): DateRange {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);
  const from = new Date(localToday);
  from.setDate(from.getDate() - 29);
  return { from: from.toISOString().slice(0, 10), to: localToday.toISOString().slice(0, 10) };
}
