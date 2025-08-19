import type { Payment } from "@/handlers/events/dataTable.config.handler"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { memo } from "react"
import { Button } from "./ui/button"

/**
 * Main Table DropDownMenu - ag-grid용
 * @returns 
 */
export const TableDropDownMenu = memo(() => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex self-start w-35 sm:w-35 lg:w-35 h-12 sm:h-12 lg:h-12 justify-center text-sm sm:text-base 
          cursor-pointer bg-white rounded-md hover:bg-gray-100/50 transition-colors border border-gray-300
          hover:border-gray-400 focus-visible:ring-0">
            Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          Column visibility will be handled by ag-grid
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
});

/**
 * Row DropDownMenu
 * @param payment 
 * @returns 
 */
export const RowDropDownMenu = ({ payment }: { payment: Payment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
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
};  