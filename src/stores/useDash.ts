import { type FieldMeta } from "./../types/dashboard";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChartSpec, WidgetState } from "@/types/dashboard";
import type { SearchInfoBody } from "./useTableDataStore";

type DashboardState = {
  FIELD_META: FieldMeta[];
  globalFilters: Omit<SearchInfoBody, "paging">;
  widgets: Record<string, WidgetState>;
  setFieldMeta: (meta: FieldMeta[]) => void;
  setTitle: (id: string, title: string) => void;
  setGlobalFilters: (filters: Omit<SearchInfoBody, "paging">) => void;
  setWidgets: (widgets: Record<string, WidgetState>) => void;
  updateWidget: (id: string, updates: Partial<WidgetState>) => void; //data 업데이트있어야 함.
  updateChartSpec: (id: string, spec: Partial<ChartSpec>) => void;
  deleteWidget: (id: string) => void;
  deleteAllWidgets: () => void;
};

export const useDash = create<DashboardState>()(
  persist(
    (set) => ({
      FIELD_META: [],
      globalFilters: {},
      widgets: {},
      setFieldMeta: (meta) => set({ FIELD_META: meta }),
      setTitle: (id, title) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: {
              ...state.widgets[id],
              title,
            },
          },
        })),

      setGlobalFilters: (filters) => set({ globalFilters: filters }),
      setWidgets: (widgets) => set({ widgets }),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { ...state.widgets[id], ...updates },
          },
        })),
      updateChartSpec: (id, spec) =>
        set((state) => {
          // xKey, yKey, seriesKey만 매핑 적용
          const mappedSpec: Partial<ChartSpec> = { ...spec };
          ["xKey", "yKey", "seriesKey"].forEach((key) => {
            if (spec[key as keyof ChartSpec]) {
              const val = spec[key as keyof ChartSpec] as string;
              mappedSpec[key as keyof ChartSpec] =
                state.FIELD_META.find((field) => field.displayName === val)
                  ?.name || val;
            }
          });
          return {
            widgets: {
              ...state.widgets,
              [id]: {
                ...state.widgets[id],
                chartSpec: { ...state.widgets[id].chartSpec, ...mappedSpec },
              },
            },
          };
        }),
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
