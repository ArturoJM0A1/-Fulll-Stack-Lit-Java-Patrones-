import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-url.token';
import { DateRange, SalesReport } from '../shared/models/sales.models';

/** Cliente para generar reportes con Spring Batch y leer resultados ya persistidos. */
@Injectable({ providedIn: 'root' })
export class SalesReportApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  generateRange(range: DateRange): Observable<SalesReport[]> {
    const params = new HttpParams().set('from', range.from).set('to', range.to);
    return this.http.post<SalesReport[]>(`${this.apiUrl}/batch/sales-report/range`, null, { params });
  }

  getReport(date: string): Observable<SalesReport> {
    const params = new HttpParams().set('date', date);
    return this.http.get<SalesReport>(`${this.apiUrl}/reports/sales`, { params });
  }
}
