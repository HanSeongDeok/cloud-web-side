import * as React from "react"
import { AgGridReact } from "ag-grid-react"
import "@/styles/DataTable.css"
import { columnDefs, onRowClicked, onSelectionChanged } from "@/handlers/dataTable.config.handler"
import { themeMaterial } from "ag-grid-community"
import { useTableDataStore } from "@/stores/useTableDataStore"

const DataTable = React.memo(() => {
  return (
      <div className="ag-theme-custom ag-grid-container">
        <AgGridReact
          theme={themeMaterial}
          rowData={useTableDataStore.getState().data}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          domLayout="autoHeight"
          rowSelection="multiple"
          suppressRowClickSelection={true}
          onRowClicked={onRowClicked}
          onSelectionChanged={onSelectionChanged}
          defaultColDef={{
            sortable: true,
            resizable: true
          }}
        />
      </div>
    )
});

export default DataTable;