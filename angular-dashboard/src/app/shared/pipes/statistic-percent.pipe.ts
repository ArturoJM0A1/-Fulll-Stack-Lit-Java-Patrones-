import { Pipe, PipeTransform } from '@angular/core';

/** Presenta un cociente de pedidos como porcentaje sin mover cálculo estadístico al template. */
@Pipe({ name: 'statisticPercent', standalone: true })
export class StatisticPercentPipe implements PipeTransform {
  transform(value: number, total: number): string {
    return total > 0 ? `${Math.round((value / total) * 100)}%` : '0%';
  }
}
