import React, { useEffect, useState } from "react";
import { useDash } from "@/stores/useDash";
import type { WidgetState } from "@/types/dashboard";
import { RotateCcw, X } from "lucide-react";
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

import ChartWidget from "../dashboard/ChartWidget";
import { fetchChartFields } from "@/handlers/services/dashboard.service.handler";
import { useColumnsStore } from "@/stores/useColumnsStore";

const DashboardPage: React.FC = () => {
  const widgets = useDash((state) => state.widgets);
  const setWidgets = useDash((state) => state.setWidgets);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const fetchColumns = useColumnsStore((state) => state.fetchStorageColumns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchChartFields().then((field) => {
        useDash.getState().setFieldMeta(field);
      }),
      fetchColumns(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  // 위젯 초기화 - localStorage에 데이터가 없을 때만
  useEffect(() => {
    // 이미 위젯이 있으면 초기화하지 않음 (persist에서 복원됨)
    if (Object.keys(widgets).length > 0) return;

    // bar 차트 유형의 초기 위젯 2개 생성 (data, series 포함)
    const initialWidgets: Record<string, WidgetState> = {
      c1: {
        title: "Default",
        chartSpec: {
          chartType: "AREA",
          xKey: "uploaded_at",
          time_grain: "MONTH",
          seriesKey: "dev_step",
          agg: "COUNT",
          stacked: false,
          direction: "vertical",
        },
        data: {
          data: [],
          series: [],
        },
      },

      c2: {
        title: "Default",
        chartSpec: {
          chartType: "BAR",
          xKey: "vehicle",
          seriesKey: "ecu",
          agg: "COUNT",
          stacked: true,
          direction: "vertical",
        },
        data: {
          data: [],
          series: [],
        },
      },
      c3: {
        title: "Default",
        chartSpec: {
          chartType: "PIE",
          xKey: undefined,
          seriesKey: "test_result",
          agg: "COUNT",
          stacked: true,
          direction: "vertical",
        },
        data: {
          data: [],
          series: [],
        },
      },
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
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">필드 정보 로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 mt-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">대시보드</h1>
      </div>
      <DashboardHeader />
      <div className="p-6 bg-[#D9D9D9] min-h-screen max-h-screen overflow-y-auto rounded-lg">
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
          <div className="flex flex-wrap gap-4 mt-6 pb-20 items-start">
            <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
              {widgetIds.map((widgetId) => (
                <DashboardPanel
                  key={widgetId}
                  widgetId={widgetId}
                  onFullscreen={setFullscreenId}
                />
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
        {/* 전체보기 모달 오버레이 */}
        {fullscreenId && widgets[fullscreenId] && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.85)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setFullscreenId(null)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                width: "100vw", // Increased width to nearly full screen
                height: "80vh", // Increased height to nearly full screen
                maxWidth: 1600, // Increased max width
                maxHeight: 1000, // Increased max height
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 5,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 18,
                }}
                onClick={() => setFullscreenId(null)}
                title="닫기"
              >
                <X />
              </button>
              {/* ChartWidget만 전체화면 */}
              <div
                style={{ flex: 1, width: "100%", height: "80%", padding: 24 }}
              >
                <ChartWidget widgetId={fullscreenId} />
              </div>
            </div>
          </div>
        )}
        {/* Floating Button - fixed to bottom left */}
        <div className="fixed left-6 bottom-6 z-50">
          <FloatingActionButtons />
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;
