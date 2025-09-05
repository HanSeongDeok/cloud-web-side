import type { ColDef } from "ag-grid-community";
import { createCustomColumn, type Column } from "@/handlers/events/dataTable.config.handler";
import { create } from "zustand";
import { fetchColumns } from "@/handlers/services/dataTable.service.handler";

export interface ColumnArray {
    originalName: string
    displayName: string
    useLut: boolean
    propertyType: string
  }

interface ColumnsStore {
    columns: ColDef<Column>[];
    mapColumns: ColumnArray[];
    setColumns: (columns: ColDef<Column>[]) => void;
    setMapColumns: (mapColumns: ColumnArray[]) => void;
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
            const mapColumns: ColumnArray[] = [];
            const columnsArray: ColDef<Column>[] = [];
            columnsData.forEach(item => {
                const headerName = item.originalName.toLowerCase().replace(/\s+/g, '');
                if (headerName === "name") {
                    return;
                }
                mapColumns.push({ originalName: headerName, displayName: item.displayName, useLut: item.useLut, propertyType: item.propertyType });
                columnsArray.push(createCustomColumn(headerName, item.displayName));
                console.log(item.originalName);
                
            });

            get().setColumns(columnsArray);
            get().setMapColumns(mapColumns);
            
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

    