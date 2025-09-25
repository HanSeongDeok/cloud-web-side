import { useDash } from "@/stores/useDash";
import {
  type AggType,
  type ChartSpec,
  type ChartType,
  type TimeGrain,
} from "./dashboard";
import type { SearchInfoBody } from "@/stores/useTableDataStore";

// ---------- chart RequestDto ----------
export interface ChartRequest {
  searchOptions: Omit<SearchInfoBody, "paging">;
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
  globalFilters: Omit<SearchInfoBody, "paging">,
  chartSpec: ChartSpec
): ChartRequest => {
  const metric: MetricMeta = {
    aggregationType: (chartSpec.agg?.toUpperCase() as AggType) || "COUNT",
  };

  // yKey가 있을 때만 targetField 추가
  if (chartSpec.yKey) {
    metric.targetField = chartSpec.yKey;
  }

  const request: ChartRequest = {
    searchOptions: globalFilters,
    metric: {
      aggregationType: (chartSpec.agg?.toUpperCase() as AggType) || "COUNT",
      targetField: chartSpec.yKey,
    },
    dimensions: [],
    chartType: (chartSpec.chartType?.toUpperCase() as ChartType) || "BAR",
  };

  // chartSpec.xKey가 TEMPORAL이 아닌 경우에만 dimension에 추가
  if (
    chartSpec.xKey &&
    useDash.getState().FIELD_META.find((f) => f.name === chartSpec.xKey)
      ?.fieldKind !== "TEMPORAL"
  ) {
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
  if (chartSpec.xKey && chartSpec.time_grain !== undefined) {
    request.time = {
      field: chartSpec.xKey,
      grain: chartSpec.time_grain.toUpperCase() as TimeGrain,
    };
  }

  return request;
};
