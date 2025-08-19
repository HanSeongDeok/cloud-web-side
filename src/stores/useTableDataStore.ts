import { create } from "zustand";
import { fetchData } from "@/handlers/services/dataTable.service.handler";
import type { PaginationInfo } from "@/stores/usePaginationState ";

interface DataTableStore {
    data: any[];
    setData: (data: any[]) => void;
    fetchData: (paginationInfo: PaginationInfo) => Promise<void>;
}

export const useDataTableStoreDev = create<DataTableStore>((set, get) => ({
    data: [],
    setData: (data) => set({ data }),
    fetchData: async (paginationInfo: PaginationInfo) => {
        try {
            const data = await fetchData(paginationInfo);
            data.forEach((item) => {
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
    setData: (data) => set({ data }),
    fetchData: async (paginationInfo: PaginationInfo) => {
        try {
            const data = await fetchData(paginationInfo);
            // data.forEach((item) => {
            //     item.testResult = item.testResult ? "PASS" : "FAIL";
            //     Object.entries(item.customColumns).forEach(([key, value]) => {
            //         item[key] = value;
            //     });
            // });

            get().setData(data);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));