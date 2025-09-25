import { Button } from "@/components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { X } from "lucide-react";
import React from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface LogHeaderProps {
  keyword: string;
  timeEnabled: boolean;
  onKeywordChange: (v: string) => void;
  onClearKeyword: () => void;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  onEnableTimeFilter: () => void;
}

const LogHeader: React.FC<LogHeaderProps> = ({
  keyword,
  onKeywordChange,
  onClearKeyword,
  onStartTimeChange,
  onEndTimeChange,
  onEnableTimeFilter,
  timeEnabled,
}) => {
  return (
    <div className="flex items-center justify-between w-full mt-15 mb-4">
      {/* 검색 키워드 입력 */}
      <div className="w-1/5 min-w-[120px] relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="검색어 입력"
          className="w-full h-9 pl-4 pr-8 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {keyword && (
          <Button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900 bg-transparent shadow-none border-none"
            onClick={onClearKeyword}
            tabIndex={-1}
            variant="ghost"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* 시간 필터 및 컬럼 설정 */}
      <div className="flex items-center gap-30">
        <div className="flex items-center w-full gap-3">
          <Checkbox
            checked={timeEnabled}
            onCheckedChange={() => {
              onEnableTimeFilter();
            }}
          />
          <Label className="text-sm whitespace-nowrap">시간</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="timestamp"
              onChange={(v) => onStartTimeChange(v ? v.toISOString() : "")}
              disabled={!timeEnabled}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 180 } },
              }}
            />
            <span className="text-gray-400">-</span>
            <DateTimePicker
              label="timestamp"
              onChange={(v) => onEndTimeChange(v ? v.toISOString() : "")}
              disabled={!timeEnabled}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 180 } },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default LogHeader;
