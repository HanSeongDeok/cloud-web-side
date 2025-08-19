// src/components/dbconfig/DbPropertyTable.tsx
import { useState, forwardRef } from "react";
import type { DbProperty } from "@/types/property";
import { AgGridReact } from "ag-grid-react";
import { getMockDbColumns } from "../../handlers/services/DbProperty.service.handler";
import type { ColDef } from "ag-grid-community";
import { PropertyEditButton } from "./PropertyEditButton";
import { LUTButton } from "./LUTButton";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { provideGlobalGridOptions } from "ag-grid-community";

interface DbPropertyTableProps {
  data: DbProperty[];
  loading: boolean;
  onEditProperty: (property: DbProperty) => void;
  onOpenLutModal: (propertyId: number) => void;
  onSelectionChanged?: () => void;
}

provideGlobalGridOptions({
  theme: "legacy",
});
ModuleRegistry.registerModules([AllCommunityModule]);

const DbPropertyTable = forwardRef<AgGridReact, DbPropertyTableProps>(
  (
    { data, loading, onEditProperty, onOpenLutModal, onSelectionChanged },
    ref
  ) => {
    //  AG-Grid 컬럼 정의 (편집 버튼, 룩업 버튼 컬럼 추가)
    const [columnDefs] = useState<ColDef[]>([
      ...(getMockDbColumns() as ColDef[]),
      {
        headerName: "룩업",
        colId: "LUT",
        flex: 0.5,
        cellStyle: { textAlign: "center" } as const,
        sortable: false,
        filter: false,
        cellRenderer: (params: { data: DbProperty }) => (
          <LUTButton
            property={params.data}
            onOpenLutModal={() => {
              onOpenLutModal(params.data.id);
              return true;
            }}
          />
        ),
      },
      {
        headerName: "편집",
        colId: "actions",
        flex: 0.5,
        cellStyle: { textAlign: "center" } as const,
        sortable: false,
        filter: false,
        cellRenderer: (params: { data: DbProperty }) => (
          <PropertyEditButton property={params.data} onEdit={onEditProperty} />
        ),
      },
    ]);

    return (
      <div>
        {loading && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-blue-700">데이터를 불러오고 있습니다...</span>
          </div>
        )}
        <div
          className="ag-theme-alpine w-full"
          style={{ height: "calc(100vh - 300px)", minHeight: "600" }}
        >
          <AgGridReact
            ref={ref}
            rowData={data}
            columnDefs={columnDefs}
            loading={loading}
            rowSelection="multiple"
            getRowStyle={(params) => {
              // 시스템 속성(BUILT_IN)인 경우 배경색 변경
              if (params.data?.property_type === "BUILT_IN") {
                return {
                  backgroundColor: "#fcf8e8", // 연한 노랑 배경
                  fontWeight: "500", // 약간 굵은 글씨
                };
              }
              return undefined;
            }}
            onSelectionChanged={() => {
              // 부모 컴포넌트의 선택 변경 핸들러 호출
              if (onSelectionChanged) {
                onSelectionChanged();
              }
            }}
            onRowClicked={(event) => {
              console.log("클릭된 행:", event.data);
            }}
          />
        </div>
      </div>
    );
  }
);

DbPropertyTable.displayName = "DbPropertyTable";

export default DbPropertyTable;
