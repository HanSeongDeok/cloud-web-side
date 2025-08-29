import type { ColDef } from "ag-grid-community";
import { createCustomColumn, type Column } from "@/handlers/events/dataTable.config.handler";
import { create } from "zustand";
import { fetchColumns } from "@/handlers/services/dataTable.service.handler";

interface mapColumns {
    id: string;
    displayName: string;
}

interface ColumnsStore {
    columns: ColDef<Column>[];
    mapColumns: mapColumns[];
    setColumns: (columns: ColDef<Column>[]) => void;
    setMapColumns: (mapColumns: mapColumns[]) => void;
    fetchColumns: () => Promise<void>;
}

export const useColumnsStore = create<ColumnsStore>((set, get) => ({
    columns: [],
    mapColumns: [],
    setColumns: (columns) => set({ columns }),
    setMapColumns: (mapColumns) => set({ mapColumns }),
    fetchColumns: async () => {
        try {
            const columnsData = await fetchColumns();

            // columnsData는 ColumnArray[] 배열이므로 직접 순회
            const mapColumns: mapColumns[] = [];
            const columnsArray: ColDef<Column>[] = [];
            columnsData.forEach(item => {
                const headerName = item.displayName.toLowerCase().replace(/\s+/g, '');
                mapColumns.push({ id: headerName, displayName: item.displayName });
                columnsArray.push(createCustomColumn(headerName, item.displayName));
            });

            console.log(columnsArray);
            get().setColumns(columnsArray);
            get().setMapColumns(mapColumns);
            // const fetchCustomColumns = columns.map((item) => item.headerName);
            // const newColumns: ColDef<Column>[] = [];
            // Object.entries(columnsArray)
            //     .filter(([_, value]) => !fetchCustomColumns.includes(value))
            //     .forEach(([key, value]) => newColumns.unshift(createCustomColumn(value, key as string)));

            // get().setColumns([...columns, ...newColumns as ColDef<Column>[]]);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

    