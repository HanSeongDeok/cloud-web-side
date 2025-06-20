import * as React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table"
import { renderDefaultTableRows, renderTableHeader, renderTableRows, useTable} from "@/handlers/dataTable.config.handler"
import "@/styles/DataTable.css"
import DataInput from "@/components/DataInput"
import { useAccordionStore } from "@/stores/useAccordionStore"
import { TableDropDownMenu } from "@/components/DropDownMenu"

const DataTable = React.memo(() => {
  const table = useTable();
  const openItems = useAccordionStore((state) => state.openItems);
  
  useEffect(() => {
    openItems.includes("filter") ? table.setPageSize(10) : table.setPageSize(15);
  }, [openItems]);

  return (
    <div>
      <div className="table-container">
        <DataInput table={table} />
        <TableDropDownMenu table={table} />
      </div>
      <div className="table-content-container">
        <Table className="table-content">
          <TableHeader>
            {renderTableHeader(table)}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ?
              renderTableRows(table) :
              renderDefaultTableRows(table)
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
});

export default DataTable;