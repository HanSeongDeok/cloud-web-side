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
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useColumnsStore } from "@/stores/useColumnsStore"

/**
 * Main Table DropDownMenu - ag-grid용
 * @returns 
 */
export const TableColumnSetting = memo(() => {
  const columns = useColumnsStore((state) => state.columns);
  const selectedColumns = useColumnsStore((state) => state.selectedColumns);
  const toggleColumnSelection = useColumnsStore((state) => state.toggleColumnSelection);
  
  // 전체 선택/해제 로직
  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      columns.forEach(column => {
        const columnField = column.field || '';
        if (selectedColumns.includes(columnField)) {
          toggleColumnSelection(columnField);
        }
      });
    } else {
      columns.forEach(column => {
        const columnField = column.field || '';
        if (!selectedColumns.includes(columnField)) {
          toggleColumnSelection(columnField);
        }
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex self-start w-35 sm:w-35 lg:w-35 h-12 sm:h-12 lg:h-12 justify-center text-sm sm:text-base 
          cursor-pointer bg-white rounded-md hover:bg-gray-100/50 transition-colors border border-gray-300
          hover:border-gray-400 focus-visible:ring-0">
            컬럼 설정 <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-58 bg-white border border-gray-300 p-0"
        style={{
          maxHeight: '400px',
          minHeight: '250px',
        }}
      >
        {/* 전체 선택/해제 체크박스 - 고정 영역 */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div
            className="cursor-pointer flex items-center space-x-3"
            onClick={handleSelectAll}
          >
            <Checkbox 
              checked={selectedColumns.length === columns.length && columns.length > 0}
              onChange={handleSelectAll}
              className="w-5 h-5 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-400"
            />
            <span className="text-base font-semibold mb-1 mt-1">전체 선택</span>
          </div>
        </div>
        
        {/* 스크롤 가능한 컬럼 목록 */}
        <ScrollArea className="h-[300px]">
          {columns.map((column, index) => {
            const columnField = column.field || '';
            const isSelected = selectedColumns.includes(columnField);
            return (
              <div
                key={index}
                className="cursor-pointer flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                onClick={() => toggleColumnSelection(columnField)}
              >
                <Checkbox 
                  checked={isSelected}
                  onChange={() => toggleColumnSelection(columnField)}
                  className="w-5 h-5 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-400"
                />
                <span className="text-base">{column.headerName || column.field}</span>
              </div>
            );
          })}
        </ScrollArea>
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