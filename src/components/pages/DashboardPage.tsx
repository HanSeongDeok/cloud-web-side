import React, { useEffect, useState } from "react";
import { useDash } from "@/stores/useDash";
import type { WidgetState } from "@/types/dashboard";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DashboardHeader from "../dashboard/DashboardHeader";
import FloatingActionButtons from "../dashboard/DashboardButton";
import DashboardPanel from "../dashboard/DashboardPanel";

const DashboardPage: React.FC = () => {
  const widgets = useDash((state) => state.widgets);
  const setWidgets = useDash((state) => state.setWidgets);

  // 위젯 초기화 - localStorage에 데이터가 없을 때만
  useEffect(() => {
    // 이미 위젯이 있으면 초기화하지 않음 (persist에서 복원됨)
    if (Object.keys(widgets).length > 0) return;

    const initialWidgets: Record<string, WidgetState> = {
      c1: {
        title: "차트 컴포넌트2",
        chartSpec: {
          chartType: "LINE",
          xKey: "uploaded_at",
          yKey: "FileSize",
          seriesKey: "FileFormat",
          agg: "AVG",
          interval: undefined,
          dateFilter: { type: "range", startDate: "", endDate: "" },
          topK: undefined,
          stacked: false,
          direction: "vertical",
        },
        data: {
          data: [
            {
              x: "2025-01",
              OK: 103,
              NG: 146,
              Pass: 189,
              Fail: 232,
            },
            {
              x: "2025-02",
              OK: 136,
              NG: 182,
              Pass: 228,
              Fail: 274,
            },
            {
              x: "2025-03",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-04",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-05",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-06",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-07",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-08",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-09",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-10",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-11",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
            {
              x: "2025-12",
              OK: 169,
              NG: 218,
              Pass: 240,
              Fail: 289,
            },
          ],
          series: [
            {
              type: "line",
              xKey: "x",
              yKey: "OK",
              yName: "OK",
            },
            {
              type: "line",
              xKey: "x",
              yKey: "NG",
              yName: "NG",
            },
            {
              type: "line",
              xKey: "x",
              yKey: "Pass",
              yName: "Pass",
            },
            {
              type: "line",
              xKey: "x",
              yKey: "Fail",
              yName: "Fail",
            },
          ],
        },
      },
      c2: {
        title: "차트 컴포넌트3",
        chartSpec: {
          chartType: "BAR",
          xKey: "Vehicle",
          yKey: undefined,
          seriesKey: "ECU",
          agg: undefined,
          interval: undefined,
          dateFilter: { type: "range", startDate: "", endDate: "" },
          topK: undefined,
          stacked: false,
          direction: "vertical",
        },
        data: {
          data: [
            {
              Vehicle: "GV80",
              ICE: 201,
              ECS: 282,
              VPC: 363,
              EPB: 445,
              CMDPS: 526,
              VCU: 607,
              SbW: 688,
              IEB: 769,
              AWD: 850,
              RMDPS: 931,
            },
            {
              Vehicle: "MX5",
              ICE: 252,
              ECS: 335,
              VPC: 417,
              EPB: 500,
              CMDPS: 582,
              VCU: 665,
              SbW: 747,
              IEB: 830,
              AWD: 912,
              RMDPS: 995,
            },
            {
              Vehicle: "IONIQ5",
              ICE: 500,
              ECS: 387,
              VPC: 471,
              EPB: 555,
              CMDPS: 643,
              VCU: 731,
              SbW: 819,
              IEB: 907,
              AWD: 995,
              RMDPS: 1083,
            },
            {
              Vehicle: "Others",
              ICE: 343,
              ECS: 267,
              VPC: 111,
              EPB: 246,
              CMDPS: 142,
              VCU: 632,
              SbW: 786,
              IEB: 565,
              AWD: 888,
              RMDPS: 23,
            },
          ],
          series: [
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "ICE",
              yName: "ICE",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "ECS",
              yName: "ECS",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "VPC",
              yName: "VPC",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "EPB",
              yName: "EPB",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "CMDPS",
              yName: "CMDPS",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "VCU",
              yName: "VCU",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "SbW",
              yName: "SbW",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "IEB",
              yName: "IEB",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "AWD",
              yName: "AWD",
              stacked: true,
            },
            {
              type: "bar",
              xKey: "Vehicle",
              yKey: "RMDPS",
              yName: "RMDPS",
              stacked: true,
            },
          ],
        },
      },
      // c4: {
      //   title: "차트 컴포넌트4",
      //   chartSpec: {
      //     chartType: "scatter",
      //     xKey: "FileSize",
      //     yKey: "id",
      //     seriesKey: "",
      //     agg: "sum",
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c5: {
      //   title: "차트 컴포넌트5",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c6: {
      //   title: "차트 컴포넌트6",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c7: {
      //   title: "차트 컴포넌트7",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c8: {
      //   title: "차트 컴포넌트8",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c9: {
      //   title: "차트 컴포넌트9",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c10: {
      //   title: "차트 컴포넌트10",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
      // c11: {
      //   title: "차트 컴포넌트11",
      //   chartSpec: {
      //     chartType: "pie",
      //     xKey: "",
      //     yKey: "",
      //     seriesKey: "FileFormat",
      //     agg: undefined,
      //     interval: undefined,
      //     dateFilter: { type: "range", startDate: "", endDate: "" },
      //     topK: undefined,
      //     stacked: false,
      //     direction: "vertical",
      //   },
      //   data: { data: [], series: [] },
      // },
    };
    setWidgets(initialWidgets);
  }, [widgets, setWidgets]); // widgets 의존성 추가

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentWidgets = useDash.getState().widgets;
      const widgetIds = Object.keys(currentWidgets);
      const oldIndex = widgetIds.indexOf(active.id as string);
      const newIndex = widgetIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedIds = arrayMove(widgetIds, oldIndex, newIndex);

        // 새로운 순서로 Record 재구성 (순서 보장)
        const reorderedWidgets: Record<string, WidgetState> = {};
        reorderedIds.forEach((id) => {
          reorderedWidgets[id] = currentWidgets[id];
        });

        // 강제로 새로운 객체 생성하여 참조 변경
        setWidgets({ ...reorderedWidgets });
      }
    }
    setActiveId(null);
  };

  const widgetIds = Object.keys(widgets);
  const activeWidget = activeId ? widgets[activeId] : null;
  const deleteAllWidgets = useDash((state) => state.deleteAllWidgets);

  const handleDeleteAllWidget = () => {
    deleteAllWidgets();
  };
  return (
    <>
      <DashboardHeader />
      <div className="p-6 bg-[#D9D9D9] min-h-screen max-h-screen overflow-y-auto">
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleDeleteAllWidget}
            variant="outline"
            size="sm"
            className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 "
            title="차트 초기화"
          >
            <RotateCcw size={16} className="mr-2" />
            초기화
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 auto-rows-max gap-4 mt-6 pb-20">
            <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
              {widgetIds.map((widgetId) => (
                <DashboardPanel key={widgetId} widgetId={widgetId} />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeWidget ? (
              <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">
                    {activeWidget.title}
                  </h3>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        {/* Floating Button - fixed to bottom left */}
        <div className="fixed left-6 bottom-6 z-50">
          <FloatingActionButtons />
        </div>
      </div>
    </>
  );
};
export default DashboardPage;
