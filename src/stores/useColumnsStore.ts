import type { ColDef } from "ag-grid-community";
import { columnDefs, createCustomColumn, type Column } from "@/handlers/events/dataTable.config.handler";
import { create } from "zustand";
import { fetchColumns } from "@/handlers/services/dataTable.service.handler";

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

            const fetchCustomColumns = columns.map((item) => item.headerName);
            const newColumns: ColDef<Column>[] = [];
            Object.entries(columnsData)
                .filter(([_, value]) => !fetchCustomColumns.includes(value))
                .forEach(([key, value]) => newColumns.unshift(createCustomColumn(value, key)));

            get().setColumns([...columns, ...newColumns]);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

    