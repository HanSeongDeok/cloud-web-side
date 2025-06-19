import * as React from "react"
import { flexRender, type Row, type Table as TableType } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTable, type Payment } from "@/handlers/dataTable.config.handler"
import "@/styles/DataTable.css"
import DataInput from "@/components/DataInput"
import { TableDropDownMenu } from "@/components/DropDownMenu"

const DataTable = React.memo(() => {
  const table = useTable();
  return (
    <div>
      <div className="table-container">
        <DataInput table={table} />
        <TableDropDownMenu table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
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


/**
 * 
 * @param table 
 * @returns 
 */
const renderTableHeader = (table: TableType<Payment>) => {
  return table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id} className="text-center">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ));
}

/**
 * 
 * @param table 
 * @returns 
 */
const renderDefaultTableRows = (table: TableType<Payment>) => {
  return <TableRow>
    <TableCell
      colSpan={table.getAllColumns().length}
      className="h-24 text-center"
    >
      No results.
    </TableCell>
  </TableRow>
}

/**
 * 
 * @param table 
 * @returns 
 */
const renderTableRows = (table: TableType<Payment>) => {
  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext())
          }
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default DataTable;