// demand-trend-chart.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { MultiSeries } from '../../../../core/models/chart-data.model';

@Component({
  selector: 'app-demand-trend-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './demand-trend-chart.component.html',
  styleUrls: ['../../reports-charts.css'],
})
export class DemandTrendChartComponent {

  readonly data = signal<MultiSeries>([
    {
      name: 'Fisioterapia',
      series: [
        { name: 'Ene', value: 18 }, { name: 'Feb', value: 22 },
        { name: 'Mar', value: 31 }, { name: 'Abr', value: 27 },
        { name: 'May', value: 35 }, { name: 'Jun', value: 40 },
        { name: 'Jul', value: 38 }, { name: 'Ago', value: 45 },
        { name: 'Sep', value: 42 }, { name: 'Oct', value: 50 },
        { name: 'Nov', value: 47 }, { name: 'Dic', value: 55 },
      ],
    },
    {
      name: 'Nutrición',
      series: [
        { name: 'Ene', value: 10 }, { name: 'Feb', value: 14 },
        { name: 'Mar', value: 20 }, { name: 'Abr', value: 18 },
        { name: 'May', value: 25 }, { name: 'Jun', value: 29 },
        { name: 'Jul', value: 31 }, { name: 'Ago', value: 27 },
        { name: 'Sep', value: 33 }, { name: 'Oct', value: 36 },
        { name: 'Nov', value: 40 }, { name: 'Dic', value: 44 },
      ],
    },
    {
      name: 'Entrenamiento Personal',
      series: [
        { name: 'Ene', value: 25 }, { name: 'Feb', value: 28 },
        { name: 'Mar', value: 22 }, { name: 'Abr', value: 30 },
        { name: 'May', value: 38 }, { name: 'Jun', value: 35 },
        { name: 'Jul', value: 42 }, { name: 'Ago', value: 48 },
        { name: 'Sep', value: 44 }, { name: 'Oct', value: 52 },
        { name: 'Nov', value: 49 }, { name: 'Dic', value: 58 },
      ],
    },
  ]);

  readonly colorScheme: Color = {
    name: 'trazofit-multi',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#d87757', '#5b9bd5', '#70c18e'],
  };

  readonly view: [number, number] = [700, 380];
}