import { Injectable } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SalesAnalytics } from './models/sales.models';

/** Prepara datasets de Chart.js fuera de los componentes que solo coordinan la pantalla. */
@Injectable({ providedIn: 'root' })
export class SalesChartDataService {
  dailyRevenue(analytics: SalesAnalytics): ChartData<'line'> {
    return {
      labels: analytics.daily.map((day) => day.date),
      datasets: [
        {
          label: 'Ingresos',
          data: analytics.daily.map((day) => day.revenueCents / 100),
          borderColor: '#278257',
          backgroundColor: '#27825718',
          fill: true,
          tension: 0.3,
          pointRadius: 2
        }
      ]
    };
  }

  productSales(analytics: SalesAnalytics): ChartData<'bar'> {
    const products = analytics.products.slice(0, 8);
    return {
      labels: products.map((product) => product.name),
      datasets: [
        {
          label: 'Unidades',
          data: products.map((product) => product.quantity),
          backgroundColor: '#ea8058',
          borderRadius: 5,
          maxBarThickness: 30
        }
      ]
    };
  }

  statusDistribution(analytics: SalesAnalytics): ChartData<'doughnut'> {
    const labels = ['RECIBIDO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'];
    const colors = ['#778bb8', '#e9a34b', '#64a779', '#2e8053'];
    return {
      labels,
      datasets: [
        {
          data: labels.map((status) => analytics.statuses[status] ?? 0),
          backgroundColor: colors,
          borderWidth: 0
        }
      ]
    };
  }

  revenueAndDiscounts(analytics: SalesAnalytics): ChartData<'bar'> {
    return {
      labels: analytics.daily.map((day) => day.date),
      datasets: [
        {
          label: 'Ingresos',
          data: analytics.daily.map((day) => day.revenueCents / 100),
          backgroundColor: '#32855b',
          borderRadius: 4
        },
        {
          label: 'Descuentos',
          data: analytics.daily.map((day) => day.discountsCents / 100),
          backgroundColor: '#ed9b73',
          borderRadius: 4
        }
      ]
    };
  }

  cartesianOptions(legend = false, monetary = true): ChartOptions<'bar' | 'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: legend, position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label ? `${context.dataset.label}: ` : '';
              const value = Number(context.raw);
              const formatted = monetary
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
                : new Intl.NumberFormat('es-MX').format(value);
              return `${label}${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#809087', font: { size: 9 } } },
        y: {
          beginAtZero: true,
          grid: { color: '#eef2ee' },
          ticks: {
            color: '#809087',
            font: { size: 9 },
            callback: (value) => String(value)
          }
        }
      }
    };
  }

  doughnutOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom' } }
    };
  }
}
