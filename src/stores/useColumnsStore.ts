import type { ColDef } from "ag-grid-community";
import {
  createCustomColumn,
  type Column,
} from "@/handlers/events/dataTable.config.handler";
import { create } from "zustand";
import { fetchStorageColumns, fetchStorageLutRules } from "@/handlers/services/StorageDataTable.service.handler";

export interface LutOption {
  id: number;
  lutValue: string;
  sortOrder: number;
}

export interface ColumnArray {
  columnName: string;
  displayName: string;
  useLut: boolean;
  luts: LutOption[];
  propertyType: string;
  [key: string]: any;
}

export interface LutRules {
  sourceMetadataId: number;
  sourceLutId: number;
  targetLutIds: number[];
  targetMetadataId: number;
}


interface ColumnsStore {
  columns: ColDef<Column>[];
  mapColumns: ColumnArray[];
  lutRules: LutRules[];
  selectedColumns: string[];
  setColumns: (columns: ColDef<Column>[]) => void;
  setMapColumns: (mapColumns: ColumnArray[]) => void;
  setLutRules: (lutRules: LutRules[]) => void;
  setSelectedColumns: (selectedColumns: string[]) => void;
  toggleColumnSelection: (columnField: string) => void;
  fetchStorageColumns: () => Promise<void>;
  fetchStorageLutRules: () => Promise<void>;
}

export const useColumnsStore = create<ColumnsStore>((set, get) => ({
  columns: [],
  mapColumns: [],
  lutRules: [],
  selectedColumns: [],
  setColumns: (columns) => set({ columns }),
  setMapColumns: (mapColumns) => set({ mapColumns }),
  setLutRules: (lutRules) => set({ lutRules }),
  setSelectedColumns: (selectedColumns) => set({ selectedColumns }),
  toggleColumnSelection: (columnField) => {
    const { selectedColumns } = get();
    const newSelectedColumns = selectedColumns.includes(columnField)
      ? selectedColumns.filter((field) => field !== columnField)
      : [...selectedColumns, columnField];
    set({ selectedColumns: newSelectedColumns });
  },
  fetchStorageLutRules: async () => {
    try {
      const lutRulesData = await fetchStorageLutRules();
      get().setLutRules(lutRulesData?.data || []);
    } catch (error) {
      console.error("Failed to fetch lut rules:", error);
    }
  },
  fetchStorageColumns: async () => {
    try {
      const columnsData = await fetchStorageColumns();
      const mapColumns: ColumnArray[] = [];
      const columnsArray: ColDef<Column>[] = [];

      const toCamelCase = (str: string): string => {
        if (str === "filesize") {
          return "fileSize";
        }
        if (str === "test_type") {
          return "testClassification";
        }
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      }

      columnsData.forEach((item) => {
        const camelCaseColumnName = toCamelCase(item.columnName);
        if (camelCaseColumnName === "registrationNumber") {
          return;
        }

        mapColumns.push({
          columnName: camelCaseColumnName,
          displayName: item.displayName,
          useLut: item.useLut,
          luts: item.luts,
          propertyType: item.propertyType,
        }); 
        columnsArray.push(
          createCustomColumn(camelCaseColumnName, item.displayName)
        );
        // console.log(camelCaseColumnName);
      });

      get().setColumns(columnsArray);
      get().setMapColumns(mapColumns);
      // 초기 로드 시 모든 컬럼을 선택된 상태로 설정
      const allColumnFields = columnsArray
        .map((col) => col.field || "")
        .filter((field) => field !== "");
      get().setSelectedColumns(allColumnFields);
    } catch (error) {
      console.error("Failed to fetch columns:", error);
    }
  },
}));
