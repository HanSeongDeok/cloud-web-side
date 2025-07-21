import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import "@/styles/DataTable.css"
import { columnDefs, onRowClicked, onSelectionChanged } from "@/handlers/dataTable.config.handler"
import { themeMaterial } from "ag-grid-community"
import { useTableDataStore } from "@/stores/useTableDataStore"
import { useColumnsStore } from "@/stores/useColumnsStore"
import { useDataTableStore } from "@/stores/useTableDataStore"

const DataTable = React.memo(() => {
  const columns = useColumnsStore((state) => state.columns);
  const fetchColumns = useColumnsStore((state) => state.fetchColumns);

  const data = useDataTableStore((state) => state.data);
  const fetchData = useDataTableStore((state) => state.fetchData);

  React.useEffect(() => {
    fetchColumns();
    fetchData();
  }, [fetchColumns, fetchData]);

  return (
      <div className="ag-theme-custom ag-grid-container">
        <AgGridReact
          theme={themeMaterial}
          rowData={data}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          domLayout="autoHeight"
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          // suppressRowClickSelection={true}
          // onRowClicked={onRowClicked}
          // onSelectionChanged={onSelectionChanged}
          defaultColDef={{
            sortable: true,
            resizable: true
          }}
        />
      </div>
    )
});

export default DataTable;