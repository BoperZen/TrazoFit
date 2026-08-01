// reports.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopProfessionalsChartComponent } from './charts/top-profesionals-chart/top-profesionals-chart.component';
import { DemandTrendChartComponent } from './charts/demand-trend-chart/demand-trend-chart.component';
import { RatingsVolumeChartComponent } from './charts/ratings-volume-chart/ratings-volume-chart.component';
import { DurationHistogramChartComponent } from './charts/duration-histogram-chart/duration-histogram-chart.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    TopProfessionalsChartComponent,
    DemandTrendChartComponent,
    RatingsVolumeChartComponent,
    DurationHistogramChartComponent,
  ],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {}