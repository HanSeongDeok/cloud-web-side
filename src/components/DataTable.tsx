import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import "@/styles/DataTable.css"
import { themeMaterial } from "ag-grid-community"
import { useColumnsStore } from "@/stores/useColumnsStore"
import type { FilterSearchBody, PaginationInfo } from "@/stores/useTableDataStore"
import { useDataTableStore } from "@/stores/useTableDataStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  ClientSideRowModelModule,
  type ColDef,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { useMemo } from "react"
import { useStepSelectionStore } from "@/stores/useSelectionStore"
import { createfiterInfo } from "@/handlers/events/filterSearch.service.handler"

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

const DataTable = React.memo(() => {
  const columns = useColumnsStore((state) => state.columns);
  const fetchColumns = useColumnsStore((state) => state.fetchColumns);

  const data = useDataTableStore((state) => state.data);
  const fetchPageData = useDataTableStore((state) => state.fetchPageData);
  const fetchFilteredData = useDataTableStore((state) => state.fetchFilteredData);

  const gridRef = React.useRef<AgGridReact<any>>(null);
  const prevPaginationInfo = React.useRef<PaginationInfo>();


  const paginationInfo = useDataTableStore((state) => state.pagination);
  const setPaginationInfo = useDataTableStore((state) => state.setPagination);

  const stepSelected = useStepSelectionStore((state) => state.selected);


  // 페이지 사이즈 옵션
  const pageSizeOptions = [10, 20, 50, 100];


  const handlePaginationChanged = async () => {
    const pageSize = paginationInfo.pageSize;
    const currentPage = paginationInfo.currentPage;  

    if (prevPaginationInfo.current) {
      const prev = prevPaginationInfo.current;

      if (prev.pageSize !== pageSize || prev.currentPage !== currentPage) {
        const filterInfo = createfiterInfo(stepSelected, paginationInfo);
        
        Array.from(stepSelected.values()).some(arr => arr.length > 0) ?
          fetchFilteredData(filterInfo as FilterSearchBody) :
          fetchPageData(paginationInfo);
      }
    }
    prevPaginationInfo.current = paginationInfo;
  };

  const onGridReady = () => {
    fetchPageData(paginationInfo);
    fetchColumns();
  };

  const handlePageSizeChange = async (newPageSize: string) => {
    const size = parseInt(newPageSize);
    const currentPage = 1;
    setPaginationInfo({ ...paginationInfo, pageSize: size, currentPage: currentPage });
  };

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "File Name",
      field: "name",
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);

  const getDataPath = React.useCallback((data: any) => data.path, []);

  return (
    <div className="w-full">
      <div className="ag-theme-custom ag-grid-container h-[1000px]">
        <AgGridReact
          ref={gridRef}
          enableBrowserTooltips={true}
          theme={themeMaterial}
          rowData={data}
          columnDefs={columns}
          rowHeight={60}
          pagination={false}
          paginationPageSize={paginationInfo.pageSize}
          suppressPaginationPanel={true}
          animateRows={true}
          domLayout="normal"
          rowSelection="multiple"
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={1}
          getDataPath={getDataPath}
          rowMultiSelectWithClick={true}
          defaultColDef={{
            sortable: true,
            resizable: true,
            cellStyle: {
              display: 'block',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '60px',
              height: '100%'
            },
          }}
          onGridReady={onGridReady}
          onPaginationChanged={handlePaginationChanged}
        />
      </div>
      {/* 커스텀 페이지 사이즈 선택기 */}
      <div className="flex items-center justify-end gap-2 mt-2 pr-2">
        <span className="text-sm text-gray-400">페이지당 행 수:</span>
        <Select value={paginationInfo.pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size: number) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
});

export default DataTable;