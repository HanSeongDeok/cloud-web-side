import { fetchDataTotalCount } from "@/handlers/services/dataTable.service.handler";      
import { create } from "zustand";


export interface PaginationInfo {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalRow: number;
}

export interface PagnationState extends PaginationInfo {
  setPageSize: (pageSize: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalRow: (totalRow: number) => void;
  fetchTotalRows: () => Promise<void>;
}

export const usePaginationStore = create<PagnationState>((set, get) => ({
    pageSize: 10,
    currentPage: 1,
    totalPages: 0,
    totalRow: 0,
    setPageSize: (pageSize) => set({ pageSize }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setTotalRow: (totalRow) => set({ totalRow }),
    fetchTotalRows: async () => {
        try {
            const response = await fetchDataTotalCount();
            const totalRow = await response.json();
            get().setTotalRow(totalRow);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));
