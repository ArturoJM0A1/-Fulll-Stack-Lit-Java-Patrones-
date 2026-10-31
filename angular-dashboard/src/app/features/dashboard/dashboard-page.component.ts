import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ArcElement, BarController, BarElement, CategoryScale, ChartData, ChartOptions, DoughnutController, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { provideCharts } from 'ng2-charts';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { AnalyticsDataService } from '../../core/analytics-data.service';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { CentsCurrencyPipe } from '../../shared/pipes/cents-currency.pipe';
import { SalesChartDataService } from '../../shared/sales-chart-data.service';
import { AnalyticsViewState, DateRange, Order } from '../../shared/models/sales.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, CentsCurrencyPipe, ChartCardComponent],
  providers: [
    provideCharts({
      // El scope de la ruta lazy evita cargar controladores de gráficas en las otras secciones.
      registerables: [
        ArcElement, BarController, BarElement, CategoryScale, DoughnutController, Filler,
        Legend, LinearScale, LineController, LineElement, PointElement, Tooltip
      ]
    })
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataService = inject(AnalyticsDataService);
  private readonly chartDataService = inject(SalesChartDataService);
  readonly state = toSignal(this.dataService.state$, {
    initialValue: { status: 'loading', range: { from: '', to: '' } } as AnalyticsViewState
  });
  readonly searchControl = this.formBuilder.nonNullable.control('');
  readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(200),
      distinctUntilChanged(),
      map((query) => query.trim().toLocaleLowerCase('es-MX'))
    ),
    { initialValue: '' }
  );
  readonly filterForm = this.formBuilder.nonNullable.group({
    from: [this.dataService.currentRange.from, Validators.required],
    to: [this.dataService.currentRange.to, Validators.required]
  });
  readonly analytics = computed(() => {
    const value = this.state();
    return value.status === 'success' ? value.analytics : null;
  });
  readonly successState = computed(() => {
    const value = this.state();
    return value.status === 'success' ? value : null;
  });
  readonly errorMessage = computed(() => {
    const value = this.state();
    return value.status === 'error' ? value.message : null;
  });
  readonly kpis = computed(() => {
    const data = this.analytics();
    return {
      revenue: data?.totalRevenueCents ?? 0,
      orders: data?.orderCount ?? 0,
      average: data?.averageOrderCents ?? 0,
      bestSeller: data?.bestSellingProduct ?? '—'
    };
  });
  readonly dailyChart = computed<ChartData<'line'>>(() =>
    this.analytics() ? this.chartDataService.dailyRevenue(this.analytics()!) : { labels: [], datasets: [] }
  );
  readonly productsChart = computed<ChartData<'bar'>>(() =>
    this.analytics() ? this.chartDataService.productSales(this.analytics()!) : { labels: [], datasets: [] }
  );
  readonly statusesChart = computed<ChartData<'doughnut'>>(() =>
    this.analytics() ? this.chartDataService.statusDistribution(this.analytics()!) : { labels: [], datasets: [] }
  );
  readonly comparisonChart = computed<ChartData<'bar'>>(() =>
    this.analytics() ? this.chartDataService.revenueAndDiscounts(this.analytics()!) : { labels: [], datasets: [] }
  );
  readonly cartesianOptions: ChartOptions = this.chartDataService.cartesianOptions();
  readonly productOptions: ChartOptions = this.chartDataService.cartesianOptions(false, false);
  readonly comparisonOptions: ChartOptions = this.chartDataService.cartesianOptions(true);
  readonly statusOptions: ChartOptions = this.chartDataService.doughnutOptions();

  ngOnInit(): void {
    // debounceTime reduce consultas al editar ambas fechas; distinctUntilChanged evita repetir el mismo rango.
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.getRawValue()),
        debounceTime(250),
        map((value) => ({ from: value.from ?? '', to: value.to ?? '' })),
        filter((range) => Boolean(range.from && range.to && range.from <= range.to)),
        distinctUntilChanged((previous, current) => previous.from === current.from && previous.to === current.to),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((range) => this.dataService.setRange(range));
  }

  refresh(): void {
    this.dataService.refresh();
  }

  filteredOrders(orders: Order[], range: DateRange): Order[] {
    const query = this.searchTerm();
    return orders
      .filter((order) => {
        const orderDate = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Mexico_City',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date(order.createdAt));
        return orderDate >= range.from && orderDate <= range.to;
      })
      .filter((order) =>
        !query ||
        String(order.id).includes(query) ||
        order.lines.some((line) => line.pizzaName.toLocaleLowerCase('es-MX').includes(query))
      );
  }
}
