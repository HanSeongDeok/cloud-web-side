import ChartHeader from "./ChartHeader";
import ChartWidget from "./ChartWidget";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { useDash } from "@/stores/useDash";

const SortableItem = ({ widgetId }: { widgetId: string }) => {
  const widget = useDash((state) => state.widgets[widgetId]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white rounded-lg shadow-md cursor-move hover:shadow-lg transition-shadow col-span-1 h-full`}
    >
      <div className="itemHeader">
        <ChartHeader
          widgetId={widgetId}
          title={widget?.title || "Unknown Widget"}
        />
      </div>

      <div
        className="itemContent"
        style={{ overflowX: "auto", width: "100%" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ChartWidget widgetId={widgetId} />
      </div>
    </div>
  );
};

const DashboardPanel: React.FC<{ widgetId: string }> = ({ widgetId }) => {
  return <SortableItem widgetId={widgetId} />;
};
export default DashboardPanel;
