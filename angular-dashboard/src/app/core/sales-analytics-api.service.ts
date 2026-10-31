import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-url.token';
import { DateRange, SalesAnalytics } from '../shared/models/sales.models';

/** Cliente del endpoint agregado por intervalo; los cálculos permanecen en Spring Boot. */
@Injectable({ providedIn: 'root' })
export class SalesAnalyticsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  getSales(range: DateRange): Observable<SalesAnalytics> {
    const params = new HttpParams().set('from', range.from).set('to', range.to);
    return this.http.get<SalesAnalytics>(`${this.apiUrl}/analytics/sales`, { params });
  }
}
