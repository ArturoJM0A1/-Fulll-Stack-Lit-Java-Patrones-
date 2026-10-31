import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

/** Envuelve Chart.js para que las features solo le entreguen datos ya preparados. */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <article class="surface chart-card">
      <header class="chart-heading">
        <div><h2>{{ title }}</h2><p>{{ subtitle }}</p></div>
      </header>
      <div class="chart-wrap">
        <canvas
          baseChart
          [type]="type"
          [data]="data"
          [options]="options"
          [attr.aria-label]="title"
          role="img"></canvas>
      </div>
    </article>
  `
})
export class ChartCardComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input({ required: true }) type: ChartType = 'line';
  @Input({ required: true }) data: ChartData = { labels: [], datasets: [] };
  @Input() options: ChartOptions = {};
}
