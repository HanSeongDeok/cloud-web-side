import type { ColDef } from "ag-grid-community";
import { columnDefs, type Column } from "@/handlers/dataTable.config.handler";
import { create } from "zustand";
import { fetchColumns } from "@/handlers/dataTable.service.handler";

interface ColumnsStore {
    columns: ColDef<Column>[];
    setColumns: (columns: ColDef<Column>[]) => void;
    fetchColumns: () => Promise<void>;
}

export const useColumnsStore = create<ColumnsStore>((set, get) => ({
    columns: [],
    setColumns: (columns) => set({ columns }),
    fetchColumns: async () => {
        try {
            const columnsData = await fetchColumns();
            const columns = columnDefs(columnsData);
            get().setColumns(columns);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

    