import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import "@/styles/DataTable.css"
import { themeMaterial } from "ag-grid-community"
import { useColumnsStore } from "@/stores/useColumnsStore"
import { useDataTableStore } from "@/stores/useTableDataStore"
import type { PaginationInfo } from "@/stores/usePaginationState "
import { usePaginationStore } from "@/stores/usePaginationState "

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
  const fetchTotalRows = usePaginationStore((state) => state.fetchTotalRows);

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

  return (
      <div className="ag-theme-custom ag-grid-container">
        <AgGridReact
          ref={gridRef}
          theme={themeMaterial}
          rowData={data}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          suppressPaginationPanel={false}
          animateRows={true}
          domLayout="normal"
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          defaultColDef={{
            sortable: true,
            resizable: true
          }}
          onGridReady={onGridReady}
          onPaginationChanged={handlePaginationChanged}
        />
      </div>
    )
});

export default DataTable;