// ratings-volume-chart.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { BubbleSeries } from '../../../../core/models/chart-data.model';

@Component({
  selector: 'app-ratings-volume-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './ratings-volume-chart.component.html',
  styleUrls: ['../../reports-charts.css'],
})
export class RatingsVolumeChartComponent {

  /**
   * x → promedio de calificación (0–5)
   * y → volumen total de citas
   * r → radio visual (proporcional a y, escalado para visibilidad)
   */
  readonly data = signal<BubbleSeries>([
    {
      name: 'Profesionales',
      series: [
        { name: 'Carlos Méndez',  x: 4.8, y: 147, r: 15 },
        { name: 'Laura Solís',    x: 4.5, y: 132, r: 14 },
        { name: 'Andrés Herrera', x: 3.9, y: 119, r: 13 },
        { name: 'Mariela Vargas', x: 4.7, y: 98,  r: 11 },
        { name: 'Diego Fuentes',  x: 3.2, y: 87,  r: 10 },
        { name: 'Sofía Jiménez',  x: 4.1, y: 76,  r: 9  },
        { name: 'Pablo Rojas',    x: 2.8, y: 65,  r: 8  },
        { name: 'Ana Torres',     x: 4.9, y: 58,  r: 8  },
        { name: 'Luis Mora',      x: 3.5, y: 45,  r: 6  },
      ],
    },
  ]);

  readonly colorScheme: Color = {
    name: 'trazofit-bubble',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#d87757'],
  };

  readonly view: [number, number] = [700, 420];
  readonly xScaleMin = 0;
  readonly xScaleMax = 5;
  readonly yScaleMin = 0;
  readonly yScaleMax = 180;
  readonly minRadius = 5;
  readonly maxRadius = 20;
}