import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDash } from "@/stores/useDash";
import { ScrollArea } from "../ui/scroll-area";
import { Trash2, Filter, Check } from "lucide-react";
import { chartTypes } from "@/types/dashboard";

// 카테고리형 변수들 (date 제외)
const categoricalKeys = [
  "FileCreator",
  "DeliverableType",
  "TestType",
  "Vehicle",
  "PTtype",
  "DevStep",
  "ECU",
  "TestItem",
  "TestResult",
  "MemType",
];

// date 변수들
const dateKeys = ["uploaded_at", "created_at"];

// X축에서 사용 가능한 키들 (카테고리형 + date)
const xKeys = [...categoricalKeys, ...dateKeys];

const yKeys = ["FileSize", "id"];
const aggTypes = ["sum", "avg", "max", "min"];
const intervals = ["year", "month", "day"];

interface ChartHeaderProps {
  widgetId: string;
  title: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ widgetId, title }) => {
  const widget = useDash((state) => state.widgets[widgetId]);
  const updateChartSpec = useDash((state) => state.updateChartSpec);
  const deleteWidget = useDash((state) => state.deleteWidget);

  // 로컬 상태로 임시 chartSpec 관리
  const [tempChartSpec, setTempChartSpec] = useState(widget?.chartSpec || {});

  // widget.chartSpec이 변경되면 tempChartSpec 동기화
  useEffect(() => {
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

      // 상호 배타적 선택 로직
      if (key === "xKey" && typeof value === "string") {
        if (newSpec.seriesKey === value) {
          newSpec.xKey = value;
          newSpec.seriesKey = undefined;
        } else {
          newSpec.xKey = value;
        }
      } else if (key === "seriesKey" && typeof value === "string") {
        if (newSpec.xKey === value) {
          newSpec.seriesKey = value;
          newSpec.xKey = undefined;
        } else {
          newSpec.seriesKey = value;
        }
      } else if (key === "topK" && typeof value === "string") {
        const numValue = parseInt(value) || undefined;
        newSpec.topK = numValue;
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
    interval,
    topK,
    topKEnabled,
    topKTarget,
    stacked,
    direction,
  } = tempChartSpec;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-center flex-1">{title}</h2>
        <button
          onClick={handleDeleteWidget}
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-300 active:shadow-inner text-white transition-colors"
          title="위젯 삭제"
          aria-label="Delete widget"
        >
          <Trash2 size={16} className="text-red-700" />
        </button>
      </div>

      {/* 기본 옵션들 - 첫 번째 줄 */}
      <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
        <Select
          value={chartType}
          onValueChange={(value) =>
            handleTempChartSpecChange("chartType", value)
          }
        >
          <SelectTrigger className="rounded-full bg-gray-100 px-4 py-2 text-black border-none shadow-sm focus:ring-2 focus:ring-gray-300">
            {chartType ? chartType : "차트 유형"}
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <ScrollArea className="h-32">
              {chartTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select
          value={xKey}
          onValueChange={(value) => handleTempChartSpecChange("xKey", value)}
        >
          <SelectTrigger className="rounded-full bg-gray-100 px-4 py-2 text-black border-none shadow-sm focus:ring-2 focus:ring-gray-300">
            {xKey
              ? `X축: ${xKey}${
                  xKey === "uploaded_at" && interval ? ` (${interval})` : ""
                }`
              : "X축"}
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg min-w-[350px]">
            <ScrollArea className="h-64">
              <div className="space-y-2 p-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    X축 선택:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {xKeys.map((x) => (
                      <SelectItem
                        key={x}
                        value={x}
                        className={`cursor-pointer ${
                          x === seriesKey
                            ? "bg-green-50 text-green-700 font-medium"
                            : ""
                        }`}
                      >
                        {x === seriesKey ? `${x} (시리즈에서 선택됨)` : x}
                      </SelectItem>
                    ))}
                  </div>
                </div>

                {xKey === "uploaded_at" && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-purple-700 mb-2">
                      시간 단위:
                    </p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {intervals
                        .filter((i) => i)
                        .map((i) => (
                          <button
                            key={i}
                            onClick={() =>
                              handleTempChartSpecChange("interval", i)
                            }
                            className={`px-2 py-1 text-xs rounded border text-center ${
                              interval === i
                                ? "bg-purple-100 border-purple-300 text-purple-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select
          value={yKey}
          onValueChange={(value) => handleTempChartSpecChange("yKey", value)}
        >
          <SelectTrigger className="rounded-full bg-gray-100 px-4 py-2 text-black border-none shadow-sm focus:ring-2 focus:ring-gray-300">
            {yKey ? `Y축: ${yKey}${agg ? ` (${agg})` : ""}` : "Y축"}
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg min-w-[300px]">
            <ScrollArea className="h-48">
              <div className="space-y-2 p-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Y축 선택:
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {yKeys.map((y) => (
                      <SelectItem key={y} value={y} className="cursor-pointer">
                        {y}
                      </SelectItem>
                    ))}
                  </div>
                </div>

                {yKey && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-blue-700 mb-2">
                      집계 방식:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {aggTypes.map((a) => (
                        <button
                          key={a}
                          onClick={() => handleTempChartSpecChange("agg", a)}
                          className={`px-2 py-1 text-xs rounded border text-left ${
                            agg === a
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select
          value={seriesKey}
          onValueChange={(value) =>
            handleTempChartSpecChange("seriesKey", value)
          }
        >
          <SelectTrigger className="rounded-full bg-gray-100 px-4 py-2 text-black border-none shadow-sm focus:ring-2 focus:ring-gray-300">
            {seriesKey ? `시리즈: ${seriesKey}` : "시리즈"}
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <ScrollArea className="h-32">
              {categoricalKeys.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className={`${
                    s === xKey ? "bg-blue-50 text-blue-700 font-medium" : ""
                  }`}
                >
                  {s === xKey ? `${s} (X축에서 선택됨)` : s}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

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
          {/* Top-K 필터링 Popover - X축이나 시리즈가 선택되었을 때만 표시 */}
          {(xKey || seriesKey) && (
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
              <PopoverContent className="w-64 p-3 bg-white" align="center">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Top-K 필터링</Label>
                    <Checkbox
                      checked={topKEnabled || false}
                      onCheckedChange={(checked) =>
                        handleTempChartSpecChange(
                          "topKEnabled",
                          checked === true
                        )
                      }
                    />
                  </div>

                  {topKEnabled && (
                    <div className="space-y-3">
                      {/* Top-K 대상 선택 */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">
                          적용 대상
                        </Label>
                        <Select
                          value={topKTarget || ""}
                          onValueChange={(value) =>
                            handleTempChartSpecChange("topKTarget", value)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            {topKTarget || "대상 선택"}
                          </SelectTrigger>
                          <SelectContent>
                            {xKey && (
                              <SelectItem value={xKey}>X축: {xKey}</SelectItem>
                            )}
                            {seriesKey && (
                              <SelectItem value={seriesKey}>
                                시리즈: {seriesKey}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
                              onClick={() =>
                                handleTempChartSpecChange("topK", num)
                              }
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
            className="p-2 rounded-md transition-all  hover:bg-green-200 text-black-600"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
