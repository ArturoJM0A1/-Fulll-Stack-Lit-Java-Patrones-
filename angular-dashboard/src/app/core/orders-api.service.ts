import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api-url.token';
import { Order } from '../shared/models/sales.models';

/** Acceso de solo lectura al contrato existente GET /api/orders. */
@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      // map valida la forma de colección esperada y evita que valores nulos contaminen la vista.
      map((orders) => orders ?? [])
    );
  }
}
