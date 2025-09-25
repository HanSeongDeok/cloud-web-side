import ChartHeader from "./ChartHeader";
import ChartWidget from "./ChartWidget";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { useDash } from "@/stores/useDash";

interface SortableItemProps {
  widgetId: string;
  onFullscreen?: (widgetId: string) => void;
}

const SortableItem = ({ widgetId, onFullscreen }: SortableItemProps) => {
  const widget = useDash((state) => state.widgets[widgetId]);
  const updateWidget = useDash((state) => state.updateWidget);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId });

  // 리사이즈 핸들러
  const handleResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    // 부모의 실제 width(px) 구하기
    const parent = (e.target as HTMLElement).closest(".flex-wrap");
    const parentWidth =
      parent instanceof HTMLElement ? parent.offsetWidth : 1200;
    // 현재 패널의 width(%), height(px)
    const startWidthPercent = widget?.layout?.widthPercent ?? 50;
    const startHeight = widget?.layout?.height || 480;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaPx = moveEvent.clientX - startX;
      const newWidthPx = (startWidthPercent / 100) * parentWidth + deltaPx;
      const newWidthPercent = Math.max(
        20,
        Math.min(100, (newWidthPx / parentWidth) * 100)
      );
      const newHeight = Math.max(
        480,
        Math.min(800, startHeight + (moveEvent.clientY - startY))
      );
      updateWidget(widgetId, {
        layout: { widthPercent: newWidthPercent, height: newHeight },
      });
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const widthPercent = widget?.layout?.widthPercent ?? 49.5;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: widget?.layout?.height || 480,
    minWidth: "20%",
    minHeight: 480,
    maxWidth: "100%",
    width: `${widthPercent}%`,
    flexBasis: `${widthPercent}%`,
    position: "relative" as const,
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white rounded-lg shadow-md cursor-move hover:shadow-lg transition-shadow`}
    >
      {/* 전체보기 버튼 (좌측 상단) */}
      <button
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          zIndex: 20,
          background: "rgba(255,255,255,0.8)",
          border: "none",
          borderRadius: 4,
          padding: 4,
          cursor: "pointer",
        }}
        title="전체보기"
        onClick={(e) => {
          e.stopPropagation();
          if (onFullscreen) onFullscreen(widgetId);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="5" height="2" rx="1" fill="#333" />
          <rect x="3" y="3" width="2" height="5" rx="1" fill="#333" />
          <rect x="12" y="3" width="5" height="2" rx="1" fill="#333" />
          <rect x="15" y="3" width="2" height="5" rx="1" fill="#333" />
          <rect x="3" y="15" width="5" height="2" rx="1" fill="#333" />
          <rect x="3" y="12" width="2" height="5" rx="1" fill="#333" />
          <rect x="12" y="15" width="5" height="2" rx="1" fill="#333" />
          <rect x="15" y="12" width="2" height="5" rx="1" fill="#333" />
        </svg>
      </button>
      <div
        className="itemHeader"
        style={{ flex: "0 0 30%", minHeight: 0, width: "100%" }}
      >
        <ChartHeader
          widgetId={widgetId}
          title={widget?.title || "Unknown Widget"}
        />
      </div>

      <div
        className="itemContent"
        style={{
          flex: "1 1 70%",
          minHeight: 0,
          width: "100%",
          overflowX: "auto",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ChartWidget widgetId={widgetId} />
      </div>
      {/* 우측하단 리사이즈 핸들러 */}
      <div
        onMouseDown={handleResize}
        style={{
          position: "absolute",
          right: 4,
          bottom: 4,
          width: 18,
          height: 18,
          cursor: "nwse-resize",
          background: "#eee",
          borderRadius: 4,
          border: "1px solid #ccc",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
        onPointerDown={(e) => e.stopPropagation()}
        title="크기 조절"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M2 10h8M4 8h6M6 6h4"
            stroke="#888"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

interface DashboardPanelProps {
  widgetId: string;
  onFullscreen?: (widgetId: string) => void;
}
const DashboardPanel: React.FC<DashboardPanelProps> = ({
  widgetId,
  onFullscreen,
}) => {
  return <SortableItem widgetId={widgetId} onFullscreen={onFullscreen} />;
};
export default DashboardPanel;
