import { DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, exhaustMap, map, Observable, of, startWith, Subject } from 'rxjs';
import { ApiRequestError } from '../../core/api-error.interceptor';
import { AnalyticsDataService } from '../../core/analytics-data.service';
import { SalesReportApiService } from '../../core/sales-report-api.service';
import { CentsCurrencyPipe } from '../../shared/pipes/cents-currency.pipe';
import { StatisticPercentPipe } from '../../shared/pipes/statistic-percent.pipe';
import { DateRange, SalesReport } from '../../shared/models/sales.models';

type ReportViewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; reports: SalesReport[] }
  | { status: 'error'; message: string };

interface ReportAction {
  type: 'generate' | 'read';
  range: DateRange;
}

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, KeyValuePipe, CentsCurrencyPipe, StatisticPercentPipe],
  templateUrl: './reports-page.component.html'
})
export class ReportsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reportsApi = inject(SalesReportApiService);
  private readonly analyticsData = inject(AnalyticsDataService);
  private readonly actions = new Subject<ReportAction>();
  readonly form = this.formBuilder.nonNullable.group({
    from: [this.analyticsData.currentRange.from, Validators.required],
    to: [this.analyticsData.currentRange.to, Validators.required]
  });

  private readonly state$: Observable<ReportViewState> = this.actions.pipe(
    // exhaustMap evita lanzar jobs duplicados mientras un intervalo ya se procesa.
    exhaustMap((action) => {
      const request: Observable<SalesReport[]> =
        action.type === 'generate'
          ? this.reportsApi.generateRange(action.range)
          : this.reportsApi.getReport(action.range.from).pipe(map((report) => [report]));
      return request.pipe(
        map((reports): ReportViewState => ({ status: 'success', reports })),
        startWith({ status: 'loading' } as ReportViewState),
        catchError((error: unknown) =>
          of<ReportViewState>({
            status: 'error',
            message: error instanceof ApiRequestError ? error.message : 'No fue posible consultar el reporte.'
          })
        )
      );
    }),
    // El flujo del formulario de generación termina junto con esta vista.
    takeUntilDestroyed(this.destroyRef),
    startWith({ status: 'idle' } as ReportViewState)
  );
  readonly state = toSignal(this.state$, { initialValue: { status: 'idle' } as ReportViewState });
  readonly successState = computed(() => {
    const value = this.state();
    return value.status === 'success' ? value : null;
  });
  readonly errorMessage = computed(() => {
    const value = this.state();
    return value.status === 'error' ? value.message : null;
  });
  readonly totalCents = computed(() => {
    const state = this.state();
    return state.status === 'success'
      ? state.reports.reduce((sum, report) => sum + report.totalCents, 0)
      : 0;
  });

  generate(): void {
    this.run({ type: 'generate' });
  }

  readPersisted(): void {
    this.run({ type: 'read' });
  }

  private run(action: Omit<ReportAction, 'range'>): void {
    const range = this.form.getRawValue();
    if (!this.form.valid || !range.from || !range.to || range.from > range.to) return;
    this.analyticsData.setRange(range);
    this.actions.next({ ...action, range });
  }
}
