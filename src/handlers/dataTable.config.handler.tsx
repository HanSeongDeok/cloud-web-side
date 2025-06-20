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
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, MoreVertical, MoreHorizontal, type LucideIcon } from "lucide-react"
import { RowDropDownMenu } from "@/components/DropDownMenu"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { flexRender, type Table as TableType } from "@tanstack/react-table"

export type Payment = {
  id: string
  download: LucideIcon
  fileName: string
  filePath: string
  fileSize: string
  fileType: string
  testType: string
  vehicle: string
  step: string
  ecu: string
  swVersion: string
  testName: string
  description: string
  memoryType: string
  user: string
  createdAt: Date
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const tableData: Payment[] = [
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "m5gr84i9",
    download: Download,
    fileName: "test.txt",
    filePath: "C:/test.txt",
    fileSize: "100 KB",
    fileType: "text/plain",
    testType: "test",
    vehicle: "test",
    step: "test",
    ecu: "test",
    swVersion: "test",
    testName: "test",
    description: "test",
    memoryType: "test",
    user: "test",
    createdAt: new Date(),
    status: "success",
    email: "ken99@example.com",
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
 * 파일명 컬럼 생성
 * @returns 파일명 컬럼
 */
const createFileNameColumn = (): ColumnDef<Payment> => ({
  accessorKey: "fileName",
  header: "File Name",
  cell: ({ row }) => <div className="font-medium">{row.getValue("fileName")}</div>,
});

/**
 * 파일 경로 컬럼 생성
 * @returns 파일 경로 컬럼
 */
const createFilePathColumn = (): ColumnDef<Payment> => ({
  accessorKey: "filePath",
  header: "File Path",
  cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("filePath")}</div>,
});

/**
 * 파일 크기 컬럼 생성
 * @returns 파일 크기 컬럼
 */
const createFileSizeColumn = (): ColumnDef<Payment> => ({
  accessorKey: "fileSize",
  header: "File Size",
  cell: ({ row }) => <div className="text-sm">{row.getValue("fileSize")}</div>,
});

/**
 * 파일 타입 컬럼 생성
 * @returns 파일 타입 컬럼
 */
const createFileTypeColumn = (): ColumnDef<Payment> => ({
  accessorKey: "fileType",
  header: "File Type",
  cell: ({ row }) => <div className="text-sm">{row.getValue("fileType")}</div>,
});

/**
 * 테스트 타입 컬럼 생성
 * @returns 테스트 타입 컬럼
 */
const createTestTypeColumn = (): ColumnDef<Payment> => ({
  accessorKey: "testType",
  header: "Test Type",
  cell: ({ row }) => <div className="capitalize">{row.getValue("testType")}</div>,
});

/**
 * 차량 컬럼 생성
 * @returns 차량 컬럼
 */
const createVehicleColumn = (): ColumnDef<Payment> => ({
  accessorKey: "vehicle",
  header: "Vehicle",
  cell: ({ row }) => <div>{row.getValue("vehicle")}</div>,
});

/**
 * 단계 컬럼 생성
 * @returns 단계 컬럼
 */
const createStepColumn = (): ColumnDef<Payment> => ({
  accessorKey: "step",
  header: "Step",
  cell: ({ row }) => <div>{row.getValue("step")}</div>,
});

/**
 * ECU 컬럼 생성
 * @returns ECU 컬럼
 */
const createEcuColumn = (): ColumnDef<Payment> => ({
  accessorKey: "ecu",
  header: "ECU",
  cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("ecu")}</div>,
});

/**
 * SW 버전 컬럼 생성
 * @returns SW 버전 컬럼
 */
const createSwVersionColumn = (): ColumnDef<Payment> => ({
  accessorKey: "swVersion",
  header: "SW Version",
  cell: ({ row }) => <div className="text-sm">{row.getValue("swVersion")}</div>,
});

/**
 * 테스트명 컬럼 생성
 * @returns 테스트명 컬럼
 */
const createTestNameColumn = (): ColumnDef<Payment> => ({
  accessorKey: "testName",
  header: "Test Name",
  cell: ({ row }) => <div className="font-medium">{row.getValue("testName")}</div>,
});

/**
 * 설명 컬럼 생성
 * @returns 설명 컬럼
 */
const createDescriptionColumn = (): ColumnDef<Payment> => ({
  accessorKey: "description",
  header: "Description",
  cell: ({ row }) => <div className="text-sm text-gray-600 max-w-xs truncate">{row.getValue("description")}</div>,
});

/**
 * 메모리 타입 컬럼 생성
 * @returns 메모리 타입 컬럼
 */
const createMemoryTypeColumn = (): ColumnDef<Payment> => ({
  accessorKey: "memoryType",
  header: "Memory Type",
  cell: ({ row }) => <div className="text-sm">{row.getValue("memoryType")}</div>,
});

/**
 * 사용자 컬럼 생성
 * @returns 사용자 컬럼
 */
const createUserColumn = (): ColumnDef<Payment> => ({
  accessorKey: "user",
  header: "User",
  cell: ({ row }) => <div>{row.getValue("user")}</div>,
});

/**
 * 생성일 컬럼 생성
 * @returns 생성일 컬럼
 */
const createCreatedAtColumn = (): ColumnDef<Payment> => ({
  accessorKey: "createdAt",
  header: "Created At",
  cell: ({ row }) => {
    const date = row.getValue("createdAt") as Date;
    return <div className="text-sm">{date.toLocaleDateString()}</div>;
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
  createFileNameColumn(),
  createFilePathColumn(),
  createFileSizeColumn(),
  createFileTypeColumn(),
  createTestTypeColumn(),
  createVehicleColumn(),
  createStepColumn(),
  createEcuColumn(),
  createSwVersionColumn(),
  createTestNameColumn(),
  createDescriptionColumn(),
  createMemoryTypeColumn(),
  createUserColumn(),
  createCreatedAtColumn(),
  createStatusColumn(),
  createEmailColumn(),
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