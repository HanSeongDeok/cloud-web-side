import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import "@/styles/DataTable.css"
import { themeMaterial } from "ag-grid-community"
import { useColumnsStore } from "@/stores/useColumnsStore"
import { useDataTableStore } from "@/stores/useTableDataStore"
import type { PaginationInfo } from "@/stores/usePaginationState "
import { usePaginationStore } from "@/stores/usePaginationState "
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

const DataTable = React.memo(() => {
  const columns = useColumnsStore((state) => state.columns);
  const fetchColumns = useColumnsStore((state) => state.fetchColumns);

  const data = useDataTableStore((state) => state.data);
  const fetchData = useDataTableStore((state) => state.fetchData);

  const gridRef = React.useRef<AgGridReact<any>>(null);
  const prevPaginationInfo = React.useRef<PaginationInfo>();

  const pageSize = usePaginationStore((state) => state.pageSize);
  const currentPage = usePaginationStore((state) => state.currentPage);
  const totalPages = usePaginationStore((state) => state.totalPages);
  const totalRow = usePaginationStore((state) => state.totalRow);

  const setPageSize = usePaginationStore((state) => state.setPageSize);
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);
  const fetchTotalRows = usePaginationStore((state) => state.fetchTotalRows);

  // 페이지 사이즈 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  const setPaginationInfo = (): void => {
    if (gridRef.current) {
      const api = gridRef.current.api;
      const pageSize = api.paginationGetPageSize();

      setPageSize(pageSize);
      fetchTotalRows();
    }
  };

  const handlePaginationChanged = () => {
    setPaginationInfo();

    const paginationInfo = {
      pageSize: pageSize,
      currentPage: currentPage,
      totalPages: totalPages,
      totalRow: totalRow,
    };

    if (prevPaginationInfo.current) {
      const prev = prevPaginationInfo.current;

      if (prev.pageSize !== pageSize || prev.currentPage !== currentPage) {
        fetchData(paginationInfo);
      }
    }

    prevPaginationInfo.current = paginationInfo;
  };

  const onGridReady = (params: any) => {
    const paginationInfo = {
      pageSize: pageSize,
      currentPage: currentPage,
      totalPages: totalPages,
      totalRow: totalRow,
    };
    prevPaginationInfo.current = paginationInfo;
    fetchData(paginationInfo);
    fetchColumns();
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    setPageSize(size);
    setCurrentPage(1);
    fetchTotalRows();
  };

  return (
    <div className="w-full">
      <div className="ag-theme-custom ag-grid-container">
        <AgGridReact
          ref={gridRef}
          enableBrowserTooltips={true}
          theme={themeMaterial}
          rowData={data}
          columnDefs={columns}
          rowHeight={60}
          pagination={false}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          animateRows={true}
          domLayout="normal"
          rowSelection="multiple"
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
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
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