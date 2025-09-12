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

//Todo: 차트 가공 컴포넌트 추가 필요
export function AggregatedAgChart({ title, spec, data }: Props) {
  // const agg = useAggregation(spec, data);
  const chartData = data.data;
  const options = useMemo(() => {
    const common = {
      title: title ? { text: title } : undefined,
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
        innerRadiusRatio: 0,
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
      if (spec.chartType === "BAR") {
        const s: AgBarSeriesOptions = {
          ...seriesConfig,
          type: "bar",
          direction:
            spec.direction === "horizontal" ? "horizontal" : "vertical",
          stacked: spec.stacked,
        };
        return s;
      }
      if (spec.chartType === "LINE") {
        const s: AgLineSeriesOptions = {
          ...seriesConfig,
          type: "line",
        };
        return s;
      }
      if (spec.chartType === "AREA") {
        const s: AgAreaSeriesOptions = {
          ...seriesConfig,
          type: "area",
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
      // axes:
      //   spec.chartType === "bar" ||
      //   spec.chartType === "area" ||
      //   spec.chartType === "line"
      //     ? [
      //         {
      //           type: "category",
      //           position: spec.direction === "horizontal" ? "left" : "bottom",
      //         },
      //         {
      //           type: "number",
      //           position: spec.direction === "horizontal" ? "bottom" : "left",
      //         },
      //       ]
      //     : undefined,
    };
  }, [data, spec.chartType, spec.stacked, spec.direction]); // ToDO : 여기 의존성 배열 한번더 확인

  return (
    <div style={{ height: 360, maxWidth: "100%" }}>
      <AgCharts options={options as AgChartOptions} />
    </div>
  );
}
