import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 재사용 가능한 Combobox 컴포넌트
interface ComboboxProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
  width?: string;
  emptyMessage?: string;
  /** If true, selecting an item won't automatically close the popover. Useful when showing dependent controls inside the popover. */
  keepOpenOnSelect?: boolean;
  /** Optional extra content rendered inside the popover under the command list (e.g. dependent controls like interval buttons). */
  extraContent?: React.ReactNode;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onValueChange,
  placeholder,
  options,
  className = "",
  width = "w-[200px]",
  emptyMessage = "선택 가능 항목이 없습니다",
  keepOpenOnSelect = false,
  extraContent,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`rounded-full bg-gray-100 px-4 py-2 text-black border-none shadow-sm focus:ring-2 focus:ring-gray-300 justify-between ${className}`}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${width} p-0 bg-white`}>
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={(currentValue) => {
                    onValueChange(
                      currentValue === value ? undefined : currentValue
                    );
                    if (!keepOpenOnSelect) setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        {extraContent && (
          <div className="p-3 border-t bg-white">{extraContent}</div>
        )}
      </PopoverContent>
    </Popover>
  );
};
