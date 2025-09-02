import { memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEcuSelectionStore } from "@/stores/useSelectionStore";
import { useColumnsStore } from "@/stores/useColumnsStore";

const ECUTypeMultiSelect = memo(() => {
    const selected = useEcuSelectionStore((state) => state.selected);
    const setSelected = useEcuSelectionStore((state) => state.setSelected);
    const mapColumns = useColumnsStore((state) => state.mapColumns);

    const lutColumns = mapColumns.filter(col => col.useLut);

    // 마지막 선택된 항목 (UI 체크용)
    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const selectedDisplayName = selected
        ? lutColumns.find(option => option.originalName === selected)?.displayName
        : "컬럼 선택";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-50 sm:w-50 lg:w-50 h-12 sm:h-12 lg:h-12 justify-between text-sm sm:text-base cursor-pointer bg-gray-100/30 hover:bg-gray-100 transition-colors border border-gray-300 hover:border-gray-400">
                    <span className="font-bold truncate">
                        {selectedDisplayName}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="flex flex-col resize overflow-hidden border-2 border-gray-300 rounded-lg shadow-lg bg-white"
                style={{
                    width: 'clamp(210px, 95vw, 210px)',
                    height: 'clamp(300px, 60vh, 300px)',
                    minWidth: 210,
                    minHeight: 300,
                    maxWidth: '95vw',
                    maxHeight: '60vh',
                }}
            >
                <div className="flex flex-col h-full">
                    <ScrollArea className="h-full pr-2" type="always">
                        <RadioGroup
                            value={selected || ""}
                            onValueChange={handleSelect}
                            className="flex flex-col space-y-1 font-bold pb-2"
                        >
                            {lutColumns.map((option) => (
                                <div
                                    key={option.originalName}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold 
                                        ${selected.includes(option.originalName)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={() => handleSelect(option.originalName)}
                                >
                                    <RadioGroupItem
                                        value={option.originalName}
                                        id={option.originalName}
                                        className={`appearance-none w-5 h-5 rounded-full border-2 data-[state=checked]:[&>span]:hidden
                                            ${option.originalName === selected
                                                ? "bg-blue-300 border-blue-400"
                                                : "bg-white border-gray-400"
                                            }`}
                                    />
                                    <Label
                                        htmlFor={option.originalName}
                                        className="text-sm sm:text-base cursor-pointer flex-1 select-none"
                                        style={{
                                            color: option.originalName === selected ? "#2563eb" : "#222",
                                            fontWeight: option.originalName === selected ? 700 : 500,
                                            transition: "color 0.2s"
                                        }}
                                    >
                                        {option.displayName}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover >
    );
});

export default ECUTypeMultiSelect;