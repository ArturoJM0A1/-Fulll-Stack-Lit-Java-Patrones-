import { Pipe, PipeTransform } from '@angular/core';

/** Convierte céntimos del DTO Java a la moneda local solo en la capa de presentación. */
@Pipe({ name: 'centsCurrency', standalone: true })
export class CentsCurrencyPipe implements PipeTransform {
  transform(cents: number | null | undefined): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format((cents ?? 0) / 100);
  }
}
