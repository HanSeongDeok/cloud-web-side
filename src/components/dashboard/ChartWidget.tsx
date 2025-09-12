import { useDash } from "@/stores/useDash";
import { AggregatedAgChart } from "./AggregatedAgChart";
import { useEffect, useMemo } from "react";
import { fetchChartData } from "@/handlers/services/dashboard.service.handler";
import type { ChartSpec } from "@/types/dashboard";

const ChartWidget: React.FC<{ widgetId: string }> = ({ widgetId }) => {
  const title = useDash((s) => s.widgets[widgetId]?.title);
  const data = useDash((s) => s.widgets[widgetId]?.data);
  const chartSpec = useDash((s) => s.widgets[widgetId]?.chartSpec); // 전체 chartSpec 구독

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
    chartSpec?.interval,
    widgetId,
  ]);

  // API 호출은 fetchRelevantSpec 변경 시에만
  useEffect(() => {
    if (!chartSpecForFetch) return;

    fetchChartData(widgetId, chartSpecForFetch) // 이미 구독하고 있는 chartSpec 사용
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
  }, [chartSpecForFetch, widgetId]); // chartSpec 의존성 추가

  // x축 데이터 개수에 따른 최소 차트 너비 계산
  const getMinChartWidth = () => {
    if (!data || !data.data || data.data.length === 0) return "100%";

    // chartSpec에서 xKey 가져오기
    const xKey = chartSpec?.xKey;
    if (!xKey) return "100%";

    // x축 고유값 개수 계산
    const xAxisValues = new Set(
      data.data.map((d: Record<string, string | number | Date>) => d[xKey])
    ).size;
    const minBarWidth = 60; // 각 x축 항목당 최소 너비
    const minChartWidth = xAxisValues * minBarWidth;
    const containerMinWidth = 400; // 컨테이너 최소 너비

    return Math.max(minChartWidth, containerMinWidth);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="overflow-x-auto overflow-y-hidden h-full"
        style={{
          minWidth: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            width: getMinChartWidth(),
            minWidth: "100%",
            height: "100%",
          }}
        >
          {/* AggregatedAgChart에서 받은 data를 가지고, 2차가공 필요 topk,topk_target, stacked 여부, direction 에 따른 가공  */}
          <AggregatedAgChart title={title} spec={chartSpec} data={data} />
        </div>
      </div>
    </div>
  );
};
export default ChartWidget;
