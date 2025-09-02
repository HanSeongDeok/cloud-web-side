import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEcuSelectionStore, useStepSelectionStore } from "@/stores/useSelectionStore";
import { lutOptions } from "@/models/multiSelectModel";
import { Label } from "@radix-ui/react-label";
import { filterSearch } from "@/handlers/services/dataTable.service.handler";
import type { FilterSearchBody } from "@/stores/useColumnsStore";
import { usePaginationStore } from "@/stores/usePaginationState ";
import { useDataTableStore } from "@/stores/useTableDataStore";


const StepMultiSelect = memo(() => {

    const selected = useStepSelectionStore((state) => state.selected);
    const setSelected = useStepSelectionStore((state) => state.setSelected);

    const pageSize = usePaginationStore((state) => state.pageSize);
    const currentPage = usePaginationStore((state) => state.currentPage);

    const setDataTableData = useDataTableStore((state) => state.setData);
    const setFiltered = useDataTableStore((state) => state.setFiltered);

    const selectAll = () => {
        if (!columnHeaderSelected) return;
        setSelected(selected.get(columnHeaderSelected)?.length === lutOptions[columnHeaderSelected]?.length ?
            new Map(selected).set(columnHeaderSelected, []) :
            new Map(selected).set(columnHeaderSelected, lutOptions[columnHeaderSelected]?.map(option => option.label)));
    };

    const columnHeaderSelected = useEcuSelectionStore((state) => state.selected);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline"
                    className="w-50 sm:w-50 lg:w-50 h-12 sm:h-12 lg:h-12 justify-between text-sm sm:text-base cursor-pointer bg-gray-100/30 hover:bg-gray-100 transition-colors border border-gray-300 hover:border-gray-400"
                    disabled={!columnHeaderSelected}
                >
                    <span className="font-bold truncate">
                        속성 선택
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
                            ${selected.get(columnHeaderSelected)?.length === lutOptions[columnHeaderSelected]?.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={selected.get(columnHeaderSelected)?.length === lutOptions[columnHeaderSelected]?.length}
                            onCheckedChange={selectAll}
                            className="pointer-events-none size-4.5 sm:size-4.5 lg:size-4.5 border-2 border-black bg-white shadow-sm  data-[state=checked]:border-black transition-all"
                        />
                        <Label
                            htmlFor={"all"}
                            className="text-base sm:text-base cursor-pointer flex-1 select-none font-bold mb-2"
                        >
                            전체 선택
                        </Label>
                    </div>
                    <Separator className="h-0.5 bg-gray-300 opacity-100" />
                    <ScrollArea className="h-[calc(100%-3rem)] pr-2">
                        <div className="flex flex-col space-y-1 font-bold pr-2 mt-2 ">
                            {columnHeaderSelected && lutOptions[columnHeaderSelected]?.map((option) => (
                                <div
                                    key={option.label}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold mb-2 
                                        ${selected.get(columnHeaderSelected)?.includes(option.label)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={async () => {
                                        if (!columnHeaderSelected) return;
                                        const updatedSelected = selected.get(columnHeaderSelected)?.includes(option.label) ?
                                            new Map(selected).set(columnHeaderSelected, selected.get(columnHeaderSelected)?.filter((item) => item !== option.label) || []) :
                                            new Map(selected).set(columnHeaderSelected, [...selected.get(columnHeaderSelected) || [], option.label]);

                                        setSelected(updatedSelected);
                                        try {
                                            const quickFilter: Record<string, string> = {};
                                            updatedSelected.forEach((values, key) => {
                                                if (values.length > 0) {
                                                    quickFilter[key] = values.join(',');
                                                }
                                            });
                                            const filterInfo: FilterSearchBody = {
                                                mode: "ONLY_QUICK_FILTER",
                                                paging: {
                                                    page: currentPage - 1,
                                                    size: pageSize
                                                },
                                                quickFilter: quickFilter
                                            };
                                            const result = await filterSearch(filterInfo);
                                            setDataTableData(result.data.items);

                                            const isTest = Array.from(updatedSelected.values()).some(arr => arr.length > 0);
                                            console.log('isTest:', isTest);

                                            Array.from(updatedSelected.values()).some(arr => arr.length > 0) ?
                                                setFiltered(true) :
                                                setFiltered(false);
                                            
                                        } catch (error) {
                                            console.error('Filter search failed:', error);
                                        }
                                    }}
                                >
                                    <Checkbox
                                        checked={selected.get(columnHeaderSelected)?.includes(option.label)}
                                        className="pointer-events-none size-4.5 sm:size-4.5 lg:size-4.5"
                                    />
                                    <Label
                                        htmlFor={option.label}
                                        className="text-sm sm:text-base cursor-pointer flex select-none"
                                        style={{
                                            color: selected.get(columnHeaderSelected)?.includes(option.label) ? "#2563eb" : "#222",
                                            fontWeight: selected.get(columnHeaderSelected)?.includes(option.label) ? 700 : 500,
                                            transition: "color 0.2s"
                                        }}
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
});

export default StepMultiSelect;
