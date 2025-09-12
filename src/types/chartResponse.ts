import type { AggType, TimeGrain } from "./dashboard";

// ---------- chart ResponseDto ----------
export interface ChartResponse {
  meta: Meta;
  shape: DataShape;
  dataNoDim?: DataNoDim; // shape == NO_DIMENSION
  dataOneDim?: DataOneDim; // shape == ONE_DIMENSION
  dataTwoDim?: DataTwoDim; // shape == TWO_DIMENSION
  totals?: Totals;
}
// -----------------------------------------
export interface ResponseTimeMeta {
  field?: string;
  grain?: TimeGrain;
  range?: DateRange;
}

export interface Meta {
  metric: MetricMeta;
  dimensions?: string[];
  time?: ResponseTimeMeta;
  queryId?: string;
  rowCount?: number;
  generatedAt?: string;
}

export interface MetricMeta {
  aggregationType: AggType;
  targetField?: string;
  unit?: string;
}

export interface TimeMeta {
  field?: string;
  grain?: TimeGrain;
  range?: DateRange;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export type DataShape = "NO_DIMENSION" | "ONE_DIMENSION" | "TWO_DIMENSION";

export interface DataNoDim {
  value: number;
}

export interface DataOneDim {
  dimensionField: string;
  rows: OneDimRow[];
}

export interface OneDimRow {
  label: string;
  value: number;
}

export interface DataTwoDim {
  groupField: string;
  seriesField: string;
  rows: TwoDimRow[];
}

export interface TwoDimRow {
  group: string;
  series: TwoDimSeries[];
}

export interface TwoDimSeries {
  label: string;
  value: number;
}

export interface Totals {
  totalCount?: number;
  executionTime?: number;
}
