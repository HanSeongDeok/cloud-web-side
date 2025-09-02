import { create } from "zustand";
import { fetchData } from "@/handlers/services/dataTable.service.handler";
import type { PaginationInfo } from "@/stores/usePaginationState ";

interface DataTableStore {
    data: any[];    
    isFiltered: boolean;
    setData: (data: any[]) => void;
    setFiltered: (filtered: boolean) => void;
    clearFiltered: () => void;
    fetchData: (paginationInfo: PaginationInfo) => Promise<void>;
}

export const useDataTableStoreDev = create<DataTableStore>((set, get) => ({
    data: [],
    isFiltered: false,
    setFiltered: (filtered) => set({ isFiltered: filtered }),
    clearFiltered: () => set({ isFiltered: false }),
    setData: (data) => set({ data }),
    fetchData: async (paginationInfo: PaginationInfo) => {
        try {
            const data = await fetchData(paginationInfo);
            data.data.items.forEach((item: any) => {
                item.testResult = item.testResult ? "PASS" : "FAIL";
                Object.entries(item.customColumns).forEach(([key, value]) => {
                    item[key] = value;
                });
            });
            get().setData(data);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

export const useDataTableStore = create<DataTableStore>((set, get) => ({
    data: [],
    isFiltered: false,
    setFiltered: (filtered) => set({ isFiltered: filtered }),
    clearFiltered: () => set({ isFiltered: false }),
    setData: (data) => set({ data }),
    fetchData: async (paginationInfo: PaginationInfo) => {
        try {
            if (get().isFiltered) {
                return;
            }
            const data = await fetchData(paginationInfo);
            get().setData(data.data.items);
            console.log(get().data);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));
