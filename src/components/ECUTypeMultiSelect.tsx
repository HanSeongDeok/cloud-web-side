import { memo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const ECUTypeMultiSelect = memo(() => {
    const selected = useEcuSelectionStore((state) => state.selected);
    const setSelected = useEcuSelectionStore((state) => state.setSelected);
    const mapColumns = useColumnsStore((state) => state.mapColumns);

    const selectAll = () => {
        setSelected(selected.length === mapColumns.length ?
            [] :
            mapColumns.map(option => option.id));
    };

    // 마지막 선택된 항목 (UI 체크용)
    const lastSelected = selected[selected.length - 1];

    const handleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected([...selected.filter(item => item !== id), id]);
        } else {
            setSelected([...selected, id]);
        }
    };

    const selectedDisplayName = selected.length > 0
        ? mapColumns.find(option => option.id === lastSelected)?.displayName
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
                <div
                        className={`flex items-center gap-2 sm:gap-3 px-2 py-1 rounded cursor-pointer transition-colors 
                            ${selected.length === mapColumns.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={selected.length === mapColumns.length}
                            onCheckedChange={selectAll}
                            className="pointer-events-none size-5 sm:size-5 lg:size-5 border-2 border-black bg-white shadow-sm data-[state=checked]:bg-blue-300 data-[state=checked]:border-black transition-all"
                        />
                        <span className="text-base sm:text-base font-bold pl-1 text-black tracking-wide">
                            전체 선택
                        </span>
                    </div>
                    <Separator className="h-0.5 bg-gray-300 opacity-100" />
                    <ScrollArea className="h-full pr-2" type="always">
                        <RadioGroup
                            value={lastSelected || ""}
                            onValueChange={handleSelect}
                            className="flex flex-col space-y-1 font-bold pb-2"
                        >
                            {mapColumns.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold 
                                        ${selected.includes(option.id)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={() => handleSelect(option.id)}
                                >
                                    <RadioGroupItem
                                        value={option.id}
                                        id={option.id}
                                        className={`appearance-none w-5 h-5 rounded-full border-2 data-[state=checked]:[&>span]:hidden
                                            ${option.id === lastSelected
                                                ? "bg-blue-300 border-blue-400"
                                                : "bg-white border-gray-400"
                                            }`}
                                    />
                                    <Label
                                        htmlFor={option.id}
                                        className="text-sm sm:text-base cursor-pointer flex-1 select-none"
                                        style={{
                                            color: option.id === lastSelected ? "#2563eb" : "#222",
                                            fontWeight: option.id === lastSelected ? 700 : 500,
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