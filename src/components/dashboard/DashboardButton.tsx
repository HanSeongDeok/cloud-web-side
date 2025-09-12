import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useDash } from "@/stores/useDash";
import type { WidgetState } from "@/types/dashboard";

export default function FloatingActionButtons() {
  const widgets = useDash((state) => state.widgets);
  const setWidgets = useDash((state) => state.setWidgets);

  const handleAddWidget = () => {
    // 새로운 위젯 ID 생성 (기존 키들 중 가장 큰 번호 + 1)
    const existingIds = Object.keys(widgets);
    const maxId =
      existingIds.length > 0
        ? Math.max(
            ...existingIds.map((id) => parseInt(id.replace(/\D/g, "")) || 0)
          )
        : 0;
    const newId = `c${maxId + 1}`;

    // 새로운 위젯 생성
    const newWidget: WidgetState = {
      title: `차트 컴포넌트${maxId + 1}`,
      chartSpec: {
        chartType: undefined,
        xKey: undefined,
        yKey: undefined,
        seriesKey: undefined,
        agg: undefined,
        topK: undefined,
        stacked: false,
        direction: "vertical",
      },
      data: { data: [], series: [] },
    };

    // 기존 위젯들에 새 위젯 추가
    const updatedWidgets = {
      ...widgets,
      [newId]: newWidget,
    };

    setWidgets(updatedWidgets);
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab color="primary" aria-label="add" onClick={handleAddWidget}>
        <AddIcon />
      </Fab>
    </Box>
  );
}
