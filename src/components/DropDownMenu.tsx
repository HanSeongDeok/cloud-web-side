import type { Payment } from "@/handlers/dataTable.config.handler"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Table } from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { memo } from "react"
import { Button } from "./ui/button"

/**
 * Main Table DropDownMenu
 * @param table 
 * @returns 
 */
export const TableDropDownMenu = ({ table }: { table: Table<Payment> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={`${column.id}-${column.getIsVisible()}`} // 리렌더링 유도
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(checked: boolean) => {
                  console.log(`Column ${column.id}: checked = ${checked}`);
                  column.toggleVisibility(checked);
                }}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

/**
 * Table Row DropDownMenu
 * @param table 
 * @returns 
 */
export const RowDropDownMenu = memo(({ payment }: { payment: Payment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
          {/* 추후 세로 케밥 버튼으로도 변경 가능 */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(payment.id)}
        >
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
});  