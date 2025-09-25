// AggregatedAgChart.tsx
import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import type {
  AgChartOptions,
  AgBarSeriesOptions,
  AgLineSeriesOptions,
  AgAreaSeriesOptions,
  AgPieSeriesOptions,
} from "ag-charts-enterprise";
import "ag-charts-enterprise";
import type { ChartData, ChartSpec } from "@/types/dashboard";

type Props = {
  title: string;
  spec: ChartSpec;
  data: ChartData;
};

export function AggregatedAgChart({ title, spec, data }: Props) {
  // topK 가공 함수
  function getTopKData(
    rawData: { [key: string]: string | number | Date }[],
    topK: number,
    target: string,
    valueKey: string
  ): { [key: string]: string | number | Date }[] {
    // target별 합산
    const sumMap = new Map<string, number>();
    rawData.forEach((row) => {
      const key = String(row[target]);
      const value = Number(row[valueKey] ?? 0);
      sumMap.set(key, (sumMap.get(key) ?? 0) + value);
    });
    // topK 추출
    const sorted = Array.from(sumMap.entries()).sort((a, b) => b[1] - a[1]);
    const topKSet = new Set(sorted.slice(0, topK).map(([k]) => k));
    // Others 합산
    let othersValue = 0;
    const filtered = rawData.filter((row) => {
      if (topKSet.has(String(row[target]))) return true;
      othersValue += Number(row[valueKey] ?? 0);
      return false;
    });
    if (othersValue > 0) {
      // Others 행 추가 (기타 값은 target에 Others, valueKey에 합산)
      const othersRow = { ...filtered[0] };
      othersRow[target] = "Others";
      othersRow[valueKey] = othersValue;
      filtered.push(othersRow);
    }
    return filtered;
  }

  // topK 적용 chartData
  let chartData = data.data;
  if (spec.topKEnabled && spec.topK && spec.topKTarget) {
    // topKTarget이 xKey 또는 seriesKey
    const target = spec.topKTarget;
    // valueKey 추출: PIE는 angleKey("value"), 그 외는 yKey
    let valueKey = "value";
    if (spec.chartType !== "PIE") {
      // 첫 series의 yKey 사용
      valueKey = (data.series[0] as { yKey?: string })?.yKey || "value";
    }
    chartData = getTopKData(chartData, spec.topK, target, valueKey);
  }
  const options = useMemo(() => {
    const common = {
      title: {
        text: title,
      },
      subtitle: undefined,
      legend: { position: "bottom" as const },
      zoom: {
        enabled: true,
      },
    };

    // PIE / DONUT
    if (spec.chartType === "PIE") {
      const pieSeries: AgPieSeriesOptions = {
        ...data.series[0],
        type: "pie",
        angleKey: "value",
        legendItemKey: spec.seriesKey || "category",
        calloutLabelKey: spec.seriesKey || "category",
      };
      return {
        ...common,
        data: chartData,
        series: [pieSeries],
      };
    }

    // SCATTER
    if (spec.chartType === "SCATTER") {
      return {
        ...common,
        data: chartData,
        series: data.series,
        marker: { size: 6 },
      };
    }

    // BAR / LINE / AREA (wide)
    const series = data.series.map((seriesConfig) => {
      // PieSeries가 섞이지 않도록 타입 분기
      if (
        spec.chartType === "BAR" &&
        "xKey" in seriesConfig &&
        "yKey" in seriesConfig
      ) {
        const { xKey, yKey, ...rest } = seriesConfig;
        const s: AgBarSeriesOptions = {
          ...rest,
          type: "bar",
          direction:
            spec.direction === "horizontal" ? "horizontal" : "vertical",
          stacked: spec.stacked,
          xKey,
          yKey,
        };
        return s;
      }
      if (
        spec.chartType === "LINE" &&
        "xKey" in seriesConfig &&
        "yKey" in seriesConfig
      ) {
        const { xKey, yKey, ...rest } = seriesConfig;
        const s: AgLineSeriesOptions = {
          ...rest,
          type: "line",
          xKey,
          yKey,
        };
        return s;
      }
      if (
        spec.chartType === "AREA" &&
        "xKey" in seriesConfig &&
        "yKey" in seriesConfig
      ) {
        const { xKey, yKey, ...rest } = seriesConfig;
        const s: AgAreaSeriesOptions = {
          ...rest,
          type: "area",
          xKey,
          yKey,
        };
        return s;
      }
      // 기본값 반환 (타입 에러 방지)
      return seriesConfig;
    });

    return {
      ...common,
      data: chartData,
      series,
      // axes: ...existing code...
    };
  }, [
    data,
    spec.chartType,
    spec.stacked,
    spec.direction,
    chartData,
    spec.seriesKey,
  ]); // 의존성 보완

  return (
    <AgCharts
      style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
      options={options as AgChartOptions}
    />
  );
}
