// duration-histogram-chart.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SingleSeries } from '../../../../core/models/chart-data.model';

@Component({
  selector: 'app-duration-histogram-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './duration-histogram-chart.component.html',
  styleUrls: ['../../reports-charts.css'],
})
export class DurationHistogramChartComponent {

  /**
   * name → rango de duración en minutos (bin continuo)
   * value → frecuencia de citas que caen en ese rango
   */
  readonly data = signal<SingleSeries>([
    { name: '0–15 min',   value: 12  },
    { name: '15–30 min',  value: 45  },
    { name: '30–45 min',  value: 89  },
    { name: '45–60 min',  value: 134 },
    { name: '60–75 min',  value: 97  },
    { name: '75–90 min',  value: 63  },
    { name: '90–105 min', value: 38  },
    { name: '105–120 min',value: 21  },
    { name: '120+ min',   value: 8   },
  ]);

  readonly colorScheme: Color = {
    name: 'trazofit-histogram',
    selectable: true,
    group: ScaleType.Ordinal,
    // Un solo color base, suficiente para histograma
    domain: ['#d87757'],
  };

  readonly view: [number, number] = [700, 380];
}