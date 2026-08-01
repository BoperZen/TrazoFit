// src/app/reports/models/chart-data.models.ts

/** Single series — bar horizontal y histograma */
export interface SingleSeriesItem {
  name: string;
  value: number;
}

export type SingleSeries = SingleSeriesItem[];

/** Multi series — line chart */
export interface SeriesPoint {
  name: string | Date;
  value: number;
}

export interface MultiSeriesItem {
  name: string;
  series: SeriesPoint[];
}

export type MultiSeries = MultiSeriesItem[];

/** Bubble/Scatter — bubble chart */
export interface BubblePoint {
  x: number;
  y: number;
  r: number;
}

export interface BubbleSeriesItem {
  name: string;
  series: (BubblePoint & { name: string })[];
}

export type BubbleSeries = BubbleSeriesItem[];