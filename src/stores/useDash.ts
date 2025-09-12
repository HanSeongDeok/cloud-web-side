import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChartSpec, WidgetState } from "@/types/dashboard";

type DashboardState = {
  // globalFilters: Record<string, any>;
  widgets: Record<string, WidgetState>;
  setWidgets: (widgets: Record<string, WidgetState>) => void;
  updateWidget: (id: string, updates: Partial<WidgetState>) => void; //data 업데이트있어야 함.
  updateChartSpec: (id: string, spec: Partial<ChartSpec>) => void;
  deleteWidget: (id: string) => void;
  deleteAllWidgets: () => void;
};

export const useDash = create<DashboardState>()(
  persist(
    (set) => ({
      // globalFilters: {},
      widgets: {},
      setWidgets: (widgets) => set({ widgets }),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { ...state.widgets[id], ...updates },
          },
        })),
      updateChartSpec: (id, spec) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: {
              ...state.widgets[id],
              chartSpec: { ...state.widgets[id].chartSpec, ...spec },
            },
          },
        })),
      deleteWidget: (id) =>
        set((state) => {
          const { [id]: deletedWidget, ...remainingWidgets } = state.widgets;
          return { widgets: remainingWidgets };
        }),
      deleteAllWidgets: () => set({ widgets: {} }),
    }),
    {
      name: "dashboard-storage", // localStorage 키 이름
      partialize: (state) => ({ widgets: state.widgets }), // widgets만 저장
    }
  )
);
