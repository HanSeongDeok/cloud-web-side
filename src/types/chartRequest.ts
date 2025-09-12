import type { AggType, ChartSpec, ChartType, TimeGrain } from "./dashboard";

// ---------- chart RequestDto ----------
export interface ChartRequest {
  metric: MetricMeta;
  dimensions: DimensionMeta[];
  time?: RequestTimeMeta;
  chartType: ChartType;
}
// -----------------------------------------
export interface MetricMeta {
  aggregationType: AggType;
  targetField?: string; // COUNT에서는 null, 나머지에서는 필수
}

export interface DimensionMeta {
  field: string;
}

export interface RequestTimeMeta {
  field: string; // ex) uploaded_at (TEMPORAL)
  grain: TimeGrain;
  // from?: string;          // yyyy-MM-dd format
  // to?: string;            // yyyy-MM-dd format
}

// ---------- ChartSpec to API chartRequestDto Converter ----------

export const convertChartSpecToRequest = (
  chartSpec: ChartSpec
): ChartRequest => {
  const request: ChartRequest = {
    metric: {
      aggregationType: (chartSpec.agg?.toUpperCase() as AggType) || "COUNT",
      targetField: chartSpec.yKey,
    },
    dimensions: [],
    chartType: (chartSpec.chartType?.toUpperCase() as ChartType) || "BAR",
  };

  // X축 dimension 추가
  if (chartSpec.xKey) {
    request.dimensions.push({
      field: chartSpec.xKey,
    });
  }

  // 시리즈 dimension 추가
  if (chartSpec.seriesKey) {
    request.dimensions.push({
      field: chartSpec.seriesKey,
    });
  }

  // 시간 정보 추가
  if (chartSpec.xKey && chartSpec.interval !== undefined) {
    request.time = {
      field: chartSpec.xKey,
      grain: chartSpec.interval.toUpperCase() as TimeGrain,
    };
  }

  return request;
};
