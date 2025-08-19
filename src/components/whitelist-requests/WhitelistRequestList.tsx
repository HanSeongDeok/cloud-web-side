// src/components/whitelist-requests/WhitelistRequestList.tsx
import { useState, forwardRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { provideGlobalGridOptions } from "ag-grid-community";
import type { PermissionRequestUser } from "@/types/whitelist";
import { ApproveButton } from "./ApproveButton";
import { RejectButton } from "./RejectButton";
import { UserInfoCell } from "./UserInfo";

interface WhitelistRequestListProps {
  data: PermissionRequestUser[];
  loading: boolean;
  onOpenAcceptModal?: (id: number) => void;
  onOpenRejectModal?: (id: number) => void;
  onSelectionChanged?: () => void;
}

provideGlobalGridOptions({
  theme: "legacy",
});
ModuleRegistry.registerModules([AllCommunityModule]);

// 액션 셀 컴포넌트를 별도로 분리
const ActionCell: React.FC<{
  data: PermissionRequestUser;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}> = ({ data, onApprove, onReject }) => (
  <div className="flex gap-2 justify-center items-center h-full">
    <ApproveButton
      handleClick={() => {
        console.log("승인 버튼 클릭 - data:", data);
        console.log("승인 버튼 클릭 - data.id:", data.id);
        onApprove?.(data.id);
      }}
    />
    <RejectButton
      handleClick={() => {
        console.log("거절 버튼 클릭 - data:", data);
        console.log("거절 버튼 클릭 - data.id:", data.id);
        onReject?.(data.id);
      }}
    />
  </div>
);

const WhitelistRequestList = forwardRef<AgGridReact, WhitelistRequestListProps>(
  (
    { data, loading, onOpenAcceptModal, onOpenRejectModal, onSelectionChanged },
    ref
  ) => {
    //  AG-Grid 컬럼 정의 (체크박스, 사용자 정보, 액션 컬럼)
    const [columnDefs] = useState<ColDef[]>([
      {
        headerName: "유저정보",
        field: "userInfo",
        flex: 2,
        cellRenderer: UserInfoCell,
        sortable: false,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        } as const,
        cellRendererParams: {
          // UserInfoCell에 전달할 추가 props
        },
      },
      // 액션 컬럼 (승인/거절 버튼)
      {
        headerName: "액션",
        colId: "actions",
        flex: 0.5,
        sortable: false,
        filter: false,
        suppressNavigable: true, // 키보드 네비게이션 비활성화
        cellRenderer: (params: { data: PermissionRequestUser }) => (
          <ActionCell
            data={params.data}
            onApprove={onOpenAcceptModal}
            onReject={onOpenRejectModal}
          />
        ),
      },
    ]);

    return (
      <div>
        {/*  로딩 상태 표시 */}
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
            rowHeight={100}
            columnDefs={columnDefs}
            loading={loading}
            rowSelection={{
              mode: "multiRow",
              checkboxes: true,
              headerCheckbox: true,
              enableClickSelection: true,
            }}
            selectionColumnDef={{
              cellClass:
                "[&_.ag-cell-wrapper]:h-full [&_.ag-cell-wrapper]:flex [&_.ag-cell-wrapper]:items-center",
              headerClass:
                "[&_.ag-header-cell-label]:h-full [&_.ag-header-cell-label]:flex [&_.ag-header-cell-label]:items-center",
            }}
            suppressHorizontalScroll={false}
            alwaysShowVerticalScroll={false}
            domLayout="normal"
            onSelectionChanged={(event) => {
              const selectedRows = event.api.getSelectedRows();
              console.log("선택된 행들:", selectedRows);
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

WhitelistRequestList.displayName = "WhitelistRequestList";

export default WhitelistRequestList;
