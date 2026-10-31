export type OrderStatus = 'RECIBIDO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO';

export interface OrderLine {
  pizzaId: number;
  pizzaName: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  lines: OrderLine[];
}

export interface DailySales {
  date: string;
  revenueCents: number;
  discountsCents: number;
  orderCount: number;
}

export interface ProductSales {
  name: string;
  quantity: number;
  revenueCents: number;
}

export interface SalesAnalytics {
  from: string;
  to: string;
  totalRevenueCents: number;
  orderCount: number;
  averageOrderCents: number;
  bestSellingProduct: string | null;
  totalDiscountCents: number;
  daily: DailySales[];
  products: ProductSales[];
  statuses: Record<string, number>;
}

export interface SalesReport {
  date: string;
  orderCount: number;
  totalCents: number;
  byStatus: Record<string, number>;
  generatedAt: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export type AnalyticsViewState =
  | { status: 'loading'; range: DateRange }
  | { status: 'success'; range: DateRange; analytics: SalesAnalytics; orders: Order[] }
  | { status: 'error'; range: DateRange; message: string };
