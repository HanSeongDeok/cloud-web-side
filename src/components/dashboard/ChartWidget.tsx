import { useDash } from "@/stores/useDash";
import { AggregatedAgChart } from "./AggregatedAgChart";
import { useEffect, useMemo } from "react";
import { fetchChartData } from "@/handlers/services/dashboard.service.handler";
import type { ChartSpec } from "@/types/dashboard";
import { generateTitle } from "@/handlers/events/chart.autogenerate.handler";

const ChartWidget: React.FC<{ widgetId: string }> = ({ widgetId }) => {
  const data = useDash((s) => s.widgets[widgetId]?.data);
  const chartSpec = useDash((s) => s.widgets[widgetId]?.chartSpec); // 전체 chartSpec 구독
  const globalFilters = useDash((s) => s.globalFilters);
  const FIELD_META = useDash((s) => s.FIELD_META);

  const title = generateTitle(chartSpec, FIELD_META);
  // API 호출용: direction과 stacked를 제외한 속성들만 감지 (useMemo로 참조 동등성 보장)
  const chartSpecForFetch: ChartSpec | null = useMemo(() => {
    if (!chartSpec) {
      console.warn(`No chartSpec found for widgetId: ${widgetId}`);
      return null;
    }
    // direction과 stacked를 제외한 속성들만 추출
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { direction, stacked, ...fetchRelevantSpec } = chartSpec;
    return fetchRelevantSpec;
  }, [
    chartSpec?.chartType,
    chartSpec?.xKey,
    chartSpec?.yKey,
    chartSpec?.seriesKey,
    chartSpec?.agg,
    chartSpec?.time_grain,
    widgetId,
  ]);

  useEffect(() => {
    if (!chartSpecForFetch) return;
    fetchChartData(globalFilters, widgetId, chartSpecForFetch)
      .then((transformedData) => {
        console.log("ChartWidget data updated:", {
          widgetId,
          chartSpec,
          data: transformedData,
        });
      })
      .catch((error) => {
        console.error("차트 데이터 집계 fetch 오류:", error);
      });
  }, [chartSpecForFetch, widgetId, globalFilters]);

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
    >
      <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}>
        <AggregatedAgChart title={title} spec={chartSpec} data={data} />
      </div>
    </div>
  );
};
export default ChartWidget;
