import type { AgPieSeriesOptions } from "ag-charts-enterprise";

type ChartDataItem = {
  [key: string]: string | number | Date;
};
export const chartTypes = ["BAR", "LINE", "AREA", "SCATTER", "PIE"] as const;
export type { ChartDataItem };

type BarSeriesConfig = {
  type: "bar";
  xKey: string;
  yKey: string;
  yName: string;
  seriesKey?: string;
  stacked?: boolean;
};
type LineSeriesConfig = {
  type: "line";
  xKey: string;
  yKey: string;
  yName: string;
  seriesKey?: string;
};
type AreaSeriesConfig = {
  type: "area";
  xKey: string;
  yKey: string;
  yName: string;
  seriesKey?: string;
};
export type SeriesConfig =
  | AgPieSeriesOptions
  | BarSeriesConfig
  | LineSeriesConfig
  | AreaSeriesConfig;

export type ChartData = {
  data: ChartDataItem[];
  series: SeriesConfig[];
};
export type ChartType = "BAR" | "LINE" | "AREA" | "SCATTER" | "PIE";
export type AggType = "COUNT" | "SUM" | "AVG" | "MAX" | "MIN";
export type TimeGrain = "YEAR" | "MONTH" | "DAY";
export type FieldKind = "CATEGORICAL" | "NUMERIC" | "TEMPORAL";

export type ChartSpec = {
  chartType: ChartType | undefined;
  xKey?: string | undefined;
  yKey?: string | undefined;
  seriesKey?: string | undefined;
  agg?: AggType | undefined;
  interval?: TimeGrain | undefined;
  topK?: number | undefined; //default : 10
  topKEnabled?: boolean | undefined; //default : false
  topKTarget?: string | undefined; //x축 또는 series 중 선택
  stacked?: boolean | undefined; //default : false
  direction?: string | undefined; //default : horizontal
  dateFilter?: {
    type: "single" | "range";
    startDate?: string | undefined;
    endDate?: string | undefined;
  };
};
export type WidgetState = {
  title: string;
  chartSpec: ChartSpec;
  data: ChartData;
};
