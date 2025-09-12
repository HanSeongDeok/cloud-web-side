import type { ColDef } from "ag-grid-community";
import { createCustomColumn, type Column } from "@/handlers/events/dataTable.config.handler";
import { create } from "zustand";
import { fetchColumns } from "@/handlers/services/dataTable.service.handler";

export interface ColumnArray {
    columnName: string
    displayName: string
    useLut: boolean
    propertyType: string
  }

interface ColumnsStore {
    columns: ColDef<Column>[];
    mapColumns: ColumnArray[];
    selectedColumns: string[];
    setColumns: (columns: ColDef<Column>[]) => void;
    setMapColumns: (mapColumns: ColumnArray[]) => void;
    setSelectedColumns: (selectedColumns: string[]) => void;
    toggleColumnSelection: (columnField: string) => void;
    fetchColumns: () => Promise<void>;
}

export const useColumnsStore = create<ColumnsStore>((set, get) => ({
    columns: [],
    mapColumns: [],
    selectedColumns: [],
    setColumns: (columns) => set({ columns }),
    setMapColumns: (mapColumns) => set({ mapColumns }),
    setSelectedColumns: (selectedColumns) => set({ selectedColumns }),
    toggleColumnSelection: (columnField) => {
        const { selectedColumns } = get();
        const newSelectedColumns = selectedColumns.includes(columnField)
            ? selectedColumns.filter(field => field !== columnField)
            : [...selectedColumns, columnField];
        set({ selectedColumns: newSelectedColumns });
    },
    fetchColumns: async () => {
        try {
            const columnsData = await fetchColumns();
            const mapColumns: ColumnArray[] = [];
            const columnsArray: ColDef<Column>[] = [];
            columnsData.forEach(item => {
                if (item.columnName === "name") {
                    return;
                }
                mapColumns.push({ columnName: item.columnName, displayName: item.displayName, useLut: item.useLut, propertyType: item.propertyType });
                columnsArray.push(createCustomColumn(item.columnName, item.displayName));                
            });

            get().setColumns(columnsArray);
            get().setMapColumns(mapColumns);
            
            // 초기 로드 시 모든 컬럼을 선택된 상태로 설정
            const allColumnFields = columnsArray.map(col => col.field || '').filter(field => field !== '');
            get().setSelectedColumns(allColumnFields);        
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    }
}));

    