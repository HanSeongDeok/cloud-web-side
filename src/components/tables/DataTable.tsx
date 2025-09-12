import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import { themeMaterial } from "ag-grid-community"
import { useColumnsStore } from "@/stores/useColumnsStore"
import type { SearchInfoBody, PaginationInfo } from "@/stores/useTableDataStore"
import { useDataTableStore } from "@/stores/useTableDataStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import "@/ag-grid-table.css"

import {
  ClientSideRowModelModule,
  type ColDef,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { useMemo } from "react"
import { useFilterLutSelectionStore } from "@/stores/useSelectionStore"
import { convertSearchMode, createfiterInfo } from "@/handlers/events/filterSearch.service.handler"
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

const DataTable = React.memo(() => {
  const columns = useColumnsStore((state) => state.columns);
  const selectedColumns = useColumnsStore((state) => state.selectedColumns);
  const fetchColumns = useColumnsStore((state) => state.fetchColumns);

  const data = useDataTableStore((state) => state.data);
  const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);

  const gridRef = React.useRef<AgGridReact<any>>(null);
  const prevPaginationInfo = React.useRef<PaginationInfo>();

  const paginationInfo = useDataTableStore((state) => state.pagination);
  const setPaginationInfo = useDataTableStore((state) => state.setPagination);

  const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
  const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);

  // 페이지 사이즈 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  const handlePaginationChanged = async () => {
    const pageSize = paginationInfo.pageSize;
    const currentPage = paginationInfo.currentPage;

    if (prevPaginationInfo.current) {
      const prev = prevPaginationInfo.current;

      if (prev.pageSize !== pageSize || prev.currentPage !== currentPage) {
        const mode = convertSearchMode(searchKeyword);
        const searchInfo = createfiterInfo(filterLutSected, paginationInfo, searchKeyword, mode);

        fetchSearchData(searchInfo as SearchInfoBody)
      }
    }
    prevPaginationInfo.current = paginationInfo;
  };

  const onGridReady = () => {
    // fetchPageData(paginationInfo);
    const mode = convertSearchMode(searchKeyword);
    const searchInfo = createfiterInfo(filterLutSected, paginationInfo, searchKeyword, mode);
    fetchSearchData(searchInfo as SearchInfoBody);
    fetchColumns();
  };

  React.useEffect(() => {
    if (gridRef.current?.api) {
      const timer = setTimeout(() => moveAutoCol(2), 0);
      return () => clearTimeout(timer);
    }
  }, [data, selectedColumns, paginationInfo, filterLutSected]);

  const handlePageSizeChange = async (newPageSize: string) => {
    const size = parseInt(newPageSize);
    const currentPage = 1;
    setPaginationInfo({ ...paginationInfo, pageSize: size, currentPage: currentPage });
  };

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "File Name",
      field: "name",
    };
  }, []);

  // 체크박스 전용 컬럼
  const checkboxCol: ColDef = {
    colId: "select",
    headerName: "",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    width: 48,
    lockPinned: true,
    resizable: false,
    sortable: false,
  };

  const moveAutoCol = (orderIndex: number) => {
    const AUTO_COL_ID = 'ag-Grid-AutoColumn';
    gridRef.current?.api?.moveColumns([AUTO_COL_ID], orderIndex);
  };

  const getDataPath = React.useCallback((data: any) => data.path, []);

  const filteredColumns = useMemo(() => {
    const filteredColumns = columns.filter(column => selectedColumns.includes(column.field || ''));
    return [checkboxCol, ...filteredColumns];
  }, [columns, selectedColumns]);

  return (
    <div className="w-full h-full">
      <div className="ag-theme-custom ag-grid-container w-full h-[calc(100vh-550px)]">
        <AgGridReact
          ref={gridRef}
          enableBrowserTooltips={true}
          theme={themeMaterial}
          rowData={data}
          columnDefs={filteredColumns}
          rowHeight={70}
          pagination={false}
          paginationPageSize={paginationInfo.pageSize}
          suppressPaginationPanel={true}
          animateRows={true}
          domLayout="normal"
          rowSelection="multiple"
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={1}
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          groupSelectsFiltered={true}
          getDataPath={getDataPath}
          headerHeight={60}
          rowMultiSelectWithClick={true}
          defaultColDef={{
            sortable: true,
            resizable: true,
            width: 200, // 모든 컬럼(헤더 포함) 칸 너비 고정
            cellStyle: {
              display: 'block',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '70px',
              height: '100%',
            },
          }}
          onGridReady={onGridReady}
          onPaginationChanged={handlePaginationChanged}
          onGridSizeChanged={() => {
            if (gridRef.current) {
              gridRef.current.api.sizeColumnsToFit();
            }
          }}
        />
      </div>
      {/* 커스텀 페이지 사이즈 선택기 */}
      <div className="flex items-center justify-end gap-2 mt-2 pr-2">
        <span className="text-sm text-gray-400">페이지당 행 수:</span>
        <Select value={paginationInfo.pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20 cursor-pointer border border-gray-300 justify-center">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 flex flex-col items-center justify-center">
            {pageSizeOptions.map((size: number) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className="cursor-pointer bg-white text-center focus:bg-blue-100"
              >
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