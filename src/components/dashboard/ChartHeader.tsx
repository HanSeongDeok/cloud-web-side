import React, { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Combobox } from "./chartcombobox";
import { useDash } from "@/stores/useDash";
import { Trash2, Filter, Check } from "lucide-react";

interface ChartHeaderProps {
  widgetId: string;
  title: string;
}
export const chartTypes = {
  BAR: "막대 차트",
  LINE: "선 차트",
  AREA: "영역 차트",
  PIE: "파이 차트",
} as const;

export const aggTypes = {
  SUM: "합계",
  AVG: "평균",
  MAX: "최댓값",
  MIN: "최솟값",
} as const;

export const timeGrain = {
  YEAR: "연간",
  MONTH: "월간",
  DAY: "일간",
} as const;
const ChartHeader: React.FC<ChartHeaderProps> = ({ widgetId, title }) => {
  const widget = useDash((state) => state.widgets[widgetId]);
  const updateChartSpec = useDash((state) => state.updateChartSpec);
  const deleteWidget = useDash((state) => state.deleteWidget);
  const FIELD_META = Object.values(useDash((state) => state.FIELD_META));
  const setTitle = useDash((state) => state.setTitle);

  // 로컬 상태로 임시 chartSpec 관리
  const [tempChartSpec, setTempChartSpec] = useState(widget?.chartSpec || {});

  // widget.chartSpec이 변경되면 tempChartSpec 동기화
  useEffect(() => {
    console.log(FIELD_META);
    if (widget?.chartSpec) {
      setTempChartSpec(widget.chartSpec);
    }
  }, [widget?.chartSpec]);

  const handleDeleteWidget = () => {
    deleteWidget(widgetId);
  };

  if (!widget) return null;

  // 로컬 상태 변경 함수
  const handleTempChartSpecChange = (
    key: keyof typeof widget.chartSpec,
    value: unknown
  ) => {
    setTempChartSpec((prev) => {
      const newSpec = { ...prev };

      // chartType 변경 시 나머지 속성 초기화
      if (key == "chartType") {
        newSpec.xKey = undefined;
        newSpec.yKey = undefined;
        newSpec.seriesKey = undefined;
        newSpec.agg = undefined;
        newSpec.time_grain = undefined;
        newSpec.topK = undefined;
        newSpec.stacked = false;
        newSpec.direction = "vertical";
        newSpec.topKEnabled = false;
        newSpec.topKTarget = undefined;
      }

      // 상호 배타적 선택 로직
      if (key === "xKey" && typeof value === "string") {
        newSpec.xKey = value;
        if (newSpec.seriesKey === value) {
          newSpec.seriesKey = "";
        }
      } else if (key === "seriesKey" && typeof value === "string") {
        newSpec.seriesKey = value;
        if (newSpec.xKey === value) {
          newSpec.xKey = "";
        }
      } else if (key === "topK" && typeof value === "string") {
        const numValue = parseInt(value) || undefined;
        newSpec.topK = numValue;
      } else if (key === "yKey" && value === undefined) {
        newSpec.yKey = undefined;
        newSpec.agg = undefined; // yKey가 없으면 agg도 초기화
      } else {
        // @ts-expect-error - Dynamic key assignment
        newSpec[key] = value;
      }

      return newSpec;
    });
  };

  // 실제 적용 함수
  const applyChartSpec = () => {
    updateChartSpec(widgetId, tempChartSpec);
  };

  const {
    chartType,
    xKey,
    yKey,
    seriesKey,
    agg,
    time_grain,
    topK,
    topKEnabled,
    topKTarget,
    stacked,
    direction,
  } = tempChartSpec;
  // 차트별 유효성 검사 함수
  const isChartValid = () => {
    if (!chartType) return false;

    if (yKey !== undefined && agg === undefined) {
      return false;
    }
    switch (chartType) {
      case "BAR":
        // BAR: X축 또는 시리즈, Y축 중 하나는 반드시 필요
        return xKey || seriesKey || yKey;

      case "LINE":
      case "AREA":
        // LINE/AREA: X축 필수(x축은 반드시 시간형 데이터), x축이 시간형이면 time_grain 선택 권장
        return (
          xKey &&
          time_grain &&
          FIELD_META.find((f) => f.name === xKey)?.fieldKind === "TEMPORAL"
        );

      case "SCATTER":
        // SCATTER: X축 필수, Y축 필수, Y축이 있으므로 agg 필수
        return xKey && yKey && agg;

      case "PIE":
        // PIE: 시리즈(카테고리) 필수, Y축이 있는 경우 agg 필수
        return seriesKey && (yKey ? agg : true);

      default:
        return false;
    }
  };
  // x축 = 항목 , y축 = 값, seriesKey = 계열
  const getDisabledReason = () => {
    if (!chartType) return "차트 타입을 선택해주세요";

    switch (chartType) {
      case "BAR":
        if (!xKey && !seriesKey) return "항목 또는 계열를 선택해주세요";
        if (yKey && !agg) return "집계 함수를 선택해주세요";
        break;

      case "LINE":
      case "AREA":
        if (!xKey) return "항목을 선택해주세요";
        if (!time_grain) return "시간 간격을 선택해주세요";
        if (yKey && !agg) return "집계 함수를 선택해주세요";
        break;

      case "SCATTER":
        if (!xKey) return "항목을 선택해주세요";
        if (!yKey) return "값을 선택해주세요";

        break;

      case "PIE":
        if (!seriesKey) return "계열을 선택해주세요";
        if (yKey && !agg) return "집계 함수를 선택해주세요";
        break;
    }

    return "";
  };

  const isValidChart = isChartValid();
  const disabledReason = getDisabledReason();

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-center flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(widgetId, e.target.value)}
            placeholder="차트 제목을 입력하세요"
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 4,
              textAlign: "center",
            }}
          />
        </h2>
        <button
          onClick={handleDeleteWidget}
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 active:shadow-inner text-white transition-colors"
          title="위젯 삭제"
          aria-label="Delete widget"
        >
          <Trash2 size={16} className="text-red-700" />
        </button>
      </div>

      {/* 기본 옵션 */}
      <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
        <Combobox
          value={chartType}
          onValueChange={(value) =>
            handleTempChartSpecChange("chartType", value)
          }
          placeholder="차트 유형"
          options={Object.entries(chartTypes).map(([value, label]) => ({
            value,
            label,
          }))}
        />

        {chartType !== "PIE" && (
          <div className="flex flex-col gap-2'">
            <Combobox
              value={xKey}
              onValueChange={(value) =>
                handleTempChartSpecChange("xKey", value)
              }
              placeholder="항목"
              keepOpenOnSelect={true}
              extraContent={
                FIELD_META.find((f) => f.name === xKey)?.fieldKind ===
                "TEMPORAL" ? (
                  <div className="flex gap-1 mt-2">
                    {Object.entries(timeGrain).map(([key, label]) => (
                      <Button
                        key={key}
                        onClick={() =>
                          handleTempChartSpecChange("time_grain", key)
                        }
                        variant="outline"
                        size="sm"
                        className={`text-xs ${
                          time_grain === key
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                ) : null
              }
              options={
                chartType === "LINE" || chartType === "AREA"
                  ? FIELD_META.filter((f) => f.fieldKind === "TEMPORAL").map(
                      (x) => ({
                        value: x.name,
                        label:
                          x.displayName === seriesKey
                            ? `${x.displayName} (계열에서 선택됨)`
                            : x.displayName,
                      })
                    )
                  : FIELD_META.filter((f) => f.fieldKind === "CATEGORICAL").map(
                      (x) => ({
                        value: x.name,
                        label:
                          x.displayName === seriesKey
                            ? `${x.displayName} (계열에서 선택됨)`
                            : x.displayName,
                      })
                    )
              }
              className={
                FIELD_META.find((f) => f.name === xKey)?.fieldKind ===
                  "TEMPORAL" && time_grain
                  ? "border-purple-200"
                  : ""
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Combobox
            value={yKey}
            onValueChange={(value) => handleTempChartSpecChange("yKey", value)}
            placeholder="값"
            keepOpenOnSelect={true}
            extraContent={
              yKey ? (
                <div className="flex flex-wrap gap-2 gap-x-5 mt-2 w-full overflow-x-auto justify-center">
                  {Object.entries(aggTypes).map(([aggType, label]) => (
                    <Button
                      key={aggType}
                      onClick={() => handleTempChartSpecChange("agg", aggType)}
                      variant="outline"
                      size="sm"
                      className={`text-xs whitespace-nowrap ${
                        agg === aggType
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              ) : null
            }
            options={FIELD_META.filter((f) => f.fieldKind === "NUMERIC").map(
              (y) => ({
                value: y.name,
                label: y.displayName,
              })
            )}
            className={yKey && agg ? "border-blue-200" : ""}
          />
        </div>

        <Combobox
          value={seriesKey}
          onValueChange={(value) =>
            handleTempChartSpecChange("seriesKey", value)
          }
          placeholder="계열"
          options={FIELD_META.filter((f) => f.fieldKind === "CATEGORICAL").map(
            (s) => ({
              value: s.name,
              label:
                s.displayName === xKey
                  ? `${s.displayName} (항목에서 선택됨)`
                  : s.displayName,
            })
          )}
        />

        {/* 기본 옵션(차트 유형, 항목, 값, 계열)과 선택적 옵션 사이 구분선 */}
        <div
          className="h-6 w-px bg-gray-200 mx-2 rounded"
          aria-hidden="true"
          title="옵션 구분"
        />

        {chartType === "BAR" && (
          <label className="flex items-center gap-1">
            <Checkbox
              checked={stacked}
              onCheckedChange={(checked) => {
                const newValue = checked === true;
                handleTempChartSpecChange("stacked", newValue);
                updateChartSpec(widgetId, { stacked: newValue });
              }}
            />
            Stacked
          </label>
        )}

        <div className="flex gap-2 items-center">
          {chartType === "BAR" && (
            <button
              type="button"
              className={`w-8 h-8 flex items-center justify-center rounded border ${
                direction === "vertical"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                const newDirection =
                  direction === "vertical" ? "horizontal" : "vertical";
                handleTempChartSpecChange("direction", newDirection);
                updateChartSpec(widgetId, { direction: newDirection });
              }}
              title={direction === "vertical" ? "세로" : "가로"}
              aria-label={direction === "vertical" ? "Vertical" : "Horizontal"}
            >
              {direction === "vertical" ? "↕️" : "↔️"}
            </button>
          )}
          {/* Top-K 필터링 Popover - X축이 선택되었을 때만 표시 */}
          {xKey && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="md"
                  className={`rounded-full px-4 py-2 border-none shadow-sm focus:ring-2 ${
                    topKEnabled
                      ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300"
                      : "bg-gray-100 text-black hover:bg-gray-200 focus:ring-gray-300"
                  }`}
                >
                  <Filter size={14} className="mr-1" />
                  {topKEnabled && topK ? `Top ${topK}` : "Top-K"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col resize border-2 border-gray-300 rounded-lg shadow-lg bg-white"
                align="center"
                style={{
                  width: "clamp(210px, 95vw, 210px)",
                  height: "clamp(300px, 60vh, 300px)",
                  minWidth: 210,
                  minHeight: 300,
                  maxWidth: "95vw",
                  maxHeight: "60vh",
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Top-K 필터링</Label>
                    <Checkbox
                      checked={topKEnabled || false}
                      onCheckedChange={(checked) => {
                        const isEnabled = checked === true;
                        handleTempChartSpecChange("topKEnabled", isEnabled);
                        updateChartSpec(widgetId, { topKEnabled: isEnabled });
                      }}
                    />
                  </div>

                  {topKEnabled && (
                    <div className="space-y-3">
                      {/* Top-K 대상 선택 */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">
                          적용 대상
                        </Label>
                        <Combobox
                          value={topKTarget}
                          onValueChange={(value) => (
                            handleTempChartSpecChange("topKTarget", value),
                            updateChartSpec(widgetId, { topKTarget: value })
                          )}
                          placeholder="대상 선택"
                          options={[
                            ...(xKey
                              ? [{ value: xKey, label: `항목: ${xKey}` }]
                              : []),
                            // ...(seriesKey
                            //   ? [
                            //       {
                            //         value: seriesKey,
                            //         label: `시리즈: ${seriesKey}`,
                            //       },
                            //     ]
                            //   : []),
                          ]}
                          className="h-8 text-xs"
                          width="w-full"
                        />
                      </div>

                      {/* Top-K 개수 입력 */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">
                          상위 개수
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={topK || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || undefined;
                            handleTempChartSpecChange("topK", value);
                            updateChartSpec(widgetId, { topK: value });
                          }}
                          placeholder="예: 10"
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* 빠른 선택 버튼 */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">
                          빠른 선택
                        </Label>
                        <div className="flex gap-1">
                          {[3, 5, 10, 20].map((num) => (
                            <button
                              key={num}
                              onClick={() => {
                                handleTempChartSpecChange("topK", num);
                                updateChartSpec(widgetId, { topK: num });
                              }}
                              className={`px-3 py-1 text-xs rounded border flex-1 transition-colors ${
                                topK === num
                                  ? "bg-green-100 border-green-300 text-green-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="xs"
            onClick={applyChartSpec}
            disabled={!isValidChart}
            title={!isValidChart ? disabledReason : "차트 적용"}
            className={`p-2 rounded-md transition-all ${
              !isValidChart
                ? "opacity-50 cursor-not-allowed bg-gray-300"
                : "hover:bg-green-200 text-black-600"
            }`}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Label htmlFor="terms" className="text-red-500 text-xs">
            {disabledReason}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
