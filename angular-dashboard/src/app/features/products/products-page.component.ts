import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { AnalyticsDataService } from '../../core/analytics-data.service';
import { AnalyticsViewState } from '../../shared/models/sales.models';
import { CentsCurrencyPipe } from '../../shared/pipes/cents-currency.pipe';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, CentsCurrencyPipe],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dataService = inject(AnalyticsDataService);
  readonly searchControl = this.formBuilder.nonNullable.control('');
  readonly query = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      map((value) => value.trim().toLocaleLowerCase('es-MX'))
    ),
    { initialValue: '' }
  );
  private readonly stateSource = toSignal(this.dataService.state$, { initialValue: null });
  readonly state = computed<AnalyticsViewState>(
    () => this.stateSource() ?? { status: 'loading', range: this.dataService.currentRange }
  );
  readonly products = computed(() => {
    const state = this.state();
    if (state.status !== 'success') return [];
    const query = this.query();
    return state.analytics.products.filter((product) => product.name.toLocaleLowerCase('es-MX').includes(query));
  });
  readonly successState = computed(() => {
    const value = this.state();
    return value.status === 'success' ? value : null;
  });
  readonly errorMessage = computed(() => {
    const value = this.state();
    return value.status === 'error' ? value.message : null;
  });

  refresh(): void {
    this.dataService.refresh();
  }
}
