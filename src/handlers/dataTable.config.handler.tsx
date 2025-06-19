import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, type LucideIcon } from "lucide-react"
import { RowDropDownMenu } from "@/components/DropDownMenu"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { flexRender, type Table as TableType } from "@tanstack/react-table"

export type Payment = {
  id: string
  download: LucideIcon
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const tableData: Payment[] = [
  {
    id: "m5gr84i9",
    download: Download,
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
  {
    id: "m5gr84i92",
    download: Download,
    amount: 314,
    status: "success",
    email: "han99@example.com",
  },
]

/**
 * TODO 추후 해당 Column 파일 별 분리 필요
 */

/**
 * 다운로드 컬럼 생성
 * @returns 다운로드 컬럼
 */
const downloadColumn = (): ColumnDef<Payment> => ({
  id: "download",
  header: "Download",
  cell: ({ row }) => {
    const Icon = row.original.download;
    return (
      <div className="flex justify-center items-center">
        <Icon className="w-4 h-4" />
      </div>
    );
  },
});

/**
 *  셀렉트 컬럼 생성
 * @returns 셀렉트 컬럼
 */
const createSelectColumn = (): ColumnDef<Payment> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      className="align-middle"
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      className="align-middle"
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
});

/**
 * 상태 컬럼 생성
 * @returns 상태 컬럼
 */
const createStatusColumn = (): ColumnDef<Payment> => ({
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <div className="capitalize">{row.getValue("status")}</div>
  ),
});

/**
 * 이메일 컬럼 생성
 * @returns 이메일 컬럼
 */
const createEmailColumn = (): ColumnDef<Payment> => ({
  accessorKey: "email",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Email
      <ArrowUpDown />
    </Button>
  ),
  cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
});

/**
 * 금액 컬럼 생성
 * @returns 금액 컬럼
 */
const createAmountColumn = (): ColumnDef<Payment> => ({
  accessorKey: "amount",
  header: () => <div className="text-right">Amount</div>,
  cell: ({ row }) => {
    const amount = parseFloat(row.getValue("amount"));
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
    return <div className="text-right font-medium">{formatted}</div>;
  },
});

/**
 * 액션 컬럼 생성
 * @returns 액션 컬럼
 */
const createActionsColumn = (): ColumnDef<Payment> => ({
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => <RowDropDownMenu payment={row.original} />,
});

const tableColumns: ColumnDef<Payment>[] = [
  createSelectColumn(),
  downloadColumn(),
  createStatusColumn(),
  createEmailColumn(),
  createAmountColumn(),
  createActionsColumn(),
];

export const useTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, 
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
  })
  return table
}

/**
 * 
 * @param table 
 * @returns 
 */
export const renderTableHeader =  (table: TableType<Payment>) => {
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
  export const renderDefaultTableRows =  (table: TableType<Payment>) => {
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
  export const renderTableRows =  (table: TableType<Payment>) => {
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