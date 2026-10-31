import { TestBed } from '@angular/core/testing';
import { SalesChartDataService } from './sales-chart-data.service';
import { SalesAnalytics } from './models/sales.models';

describe('SalesChartDataService', () => {
  it('prepara las cuatro visualizaciones desde los agregados recibidos', () => {
    const service = TestBed.inject(SalesChartDataService);
    const analytics: SalesAnalytics = {
      from: '2026-10-01',
      to: '2026-10-01',
      totalRevenueCents: 1800,
      orderCount: 2,
      averageOrderCents: 900,
      bestSellingProduct: 'Margarita',
      totalDiscountCents: 200,
      daily: [{ date: '2026-10-01', revenueCents: 1800, discountsCents: 200, orderCount: 2 }],
      products: [{ name: 'Margarita', quantity: 3, revenueCents: 2000 }],
      statuses: { RECIBIDO: 1, ENTREGADO: 1 }
    };

    expect(service.dailyRevenue(analytics).datasets[0].data).toEqual([18]);
    expect(service.productSales(analytics).datasets[0].data).toEqual([3]);
    expect(service.statusDistribution(analytics).datasets[0].data).toEqual([1, 0, 0, 1]);
    expect(service.revenueAndDiscounts(analytics).datasets.map((dataset) => dataset.data)).toEqual([[18], [2]]);
  });
});
