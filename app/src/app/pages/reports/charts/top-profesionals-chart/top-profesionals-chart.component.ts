// top-professionals-chart.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SingleSeries } from '../../../../core/models/chart-data.model';

@Component({
  selector: 'app-top-professionals-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './top-professionals-chart.component.html',
  styleUrls: ['../../reports-charts.css'],
})
export class TopProfessionalsChartComponent {

  readonly data = signal<SingleSeries>([
    { name: 'Carlos Méndez',   value: 147 },
    { name: 'Laura Solís',     value: 132 },
    { name: 'Andrés Herrera',  value: 119 },
    { name: 'Mariela Vargas',  value: 98  },
    { name: 'Diego Fuentes',   value: 87  },
    { name: 'Sofía Jiménez',   value: 76  },
    { name: 'Pablo Rojas',     value: 65  },
  ]);

  readonly colorScheme: Color = {
    name: 'trazofit',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#d87757', '#e8956d', '#f0b090', '#c4604a', '#a84a38', '#8a3328', '#6e2018'],
  };

  // Dimensiones responsivas
  readonly view: [number, number] = [700, 380];
}