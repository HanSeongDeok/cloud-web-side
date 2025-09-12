import * as React from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import "./DateRangeCalendar.css";

export function DateSearchForm({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (d?: Date) => void;
  setEndDate: (d?: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  // 외부 값이 바뀌면 동기화(선택)
  React.useEffect(() => {
    setRange({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  const displayValue =
    range?.from && range?.to
      ? `${format(range.from, "yyyy-MM-dd")} ~ ${format(range.to, "yyyy-MM-dd")}`
      : range?.from
      ? `${format(range.from, "yyyy-MM-dd")} ~`
      : "";

  const handleClear = () => {
    setRange(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4 mt-2">
      <Label className="col-span-4 mb-1 text-left ml-1 text-base font-bold text-gray-800">
        날짜 범위
      </Label>

      <div className="col-span-4">
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                readOnly
                value={displayValue}
                placeholder="날짜 범위 선택"
                className="!text-base h-12 border border-gray-300 rounded-md pr-10 cursor-pointer"
                onClick={() => setOpen(true)}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2 cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CalendarIcon className="size-4" />
                <span className="sr-only">날짜 범위 선택</span>
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-auto relative resize-x"
            style={{ 
              minWidth: "min(550px, 70vw)",
              maxWidth: "min(900px, 70vw)",
              maxHeight: "70vh",
              width: "650px",
              display: "inline-block",
            }}
            align="center"
            sideOffset={12}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {e.preventDefault()}}
            onPointerDownOutside={(e) => {e.preventDefault()}}
          >
            <div className="date-range-calendar">
              <Calendar
                className="w-full h-full max-w-70vw max-h-70vh overflow-auto"
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={(r) => {
                  setRange(r);
                  setStartDate(r?.from);
                  setEndDate(r?.to);
                }}
                captionLayout="dropdown"   
                fromYear={2000}            
                toYear={2035}
                showOutsideDays={false}
                fixedWeeks
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-400 pt-3 mt-3 w-full min-w-0 max-w-full box-border">
              <Button className="cursor-pointer bg-white hover:bg-gray-100 border border-gray-400" variant="ghost" onClick={handleClear}>초기화</Button>
              <Button className="cursor-pointer bg-white hover:bg-gray-100 border border-gray-400" variant="secondary" onClick={() => setOpen(false)}>확인</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}