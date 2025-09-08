import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lutOptions } from "@/models/multiSelectModel";
import { Label } from "@radix-ui/react-label";
import { useDataTableStore } from "@/stores/useTableDataStore";
import { createfiterInfo } from "@/handlers/events/filterSearch.service.handler";
import type { FilterSearchBody } from "@/stores/useTableDataStore";
import { useFilterColumnHeaderSelectionStore, useFilterLutSelectionStore } from "@/stores/useSelectionStore";


const FilterLut = memo(() => {
    const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
    const setFilterLutSectedSelected = useFilterLutSelectionStore((state) => state.setSelected);

    const filterColumnHeaderSelected = useFilterColumnHeaderSelectionStore((state) => state.selected);
    const paginationInfo = useDataTableStore((state) => state.pagination);

    const fetchFilteredData = useDataTableStore((state) => state.fetchFilteredData);
    const fetchPageData = useDataTableStore((state) => state.fetchPageData);

    const selectAll = () => {
        if (!filterColumnHeaderSelected) return;
        setFilterLutSectedSelected(filterLutSected.get(filterColumnHeaderSelected)?.length === lutOptions[filterColumnHeaderSelected]?.length ?
            new Map(filterLutSected).set(filterColumnHeaderSelected, []) :
            new Map(filterLutSected).set(filterColumnHeaderSelected, lutOptions[filterColumnHeaderSelected]?.map(option => option.label)));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline"
                    className="w-50 sm:w-50 lg:w-50 h-12 sm:h-12 lg:h-12 justify-between text-sm sm:text-base cursor-pointer bg-gray-100/30 hover:bg-gray-100 transition-colors border border-gray-300 hover:border-gray-400"
                    disabled={!filterColumnHeaderSelected}
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
                            ${filterLutSected.get(filterColumnHeaderSelected)?.length === lutOptions[filterColumnHeaderSelected]?.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={filterLutSected.get(filterColumnHeaderSelected)?.length === lutOptions[filterColumnHeaderSelected]?.length || false}
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
                            {filterColumnHeaderSelected && lutOptions[filterColumnHeaderSelected]?.map((option) => (
                                <div
                                    key={option.label}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold mb-2 
                                        ${filterLutSected.get(filterColumnHeaderSelected)?.includes(option.label)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={async () => {
                                        if (!filterColumnHeaderSelected) return;
                                        const updatedSelected = filterLutSected.get(filterColumnHeaderSelected)?.includes(option.label) ?
                                            new Map(filterLutSected).set(filterColumnHeaderSelected, filterLutSected.get(filterColumnHeaderSelected)?.filter((item) => item !== option.label) || []) :
                                            new Map(filterLutSected).set(filterColumnHeaderSelected, [...filterLutSected.get(filterColumnHeaderSelected) || [], option.label]);

                                        setFilterLutSectedSelected(updatedSelected);
                                        try {
                                            const quickFilter: Record<string, string[]> = {};
                                            updatedSelected.forEach((values, key) => {
                                                if (values.length > 0) {
                                                    quickFilter[key] = values; // 배열로 바로 할당
                                                }
                                            });
                                            const filterInfo = await createfiterInfo(updatedSelected, paginationInfo);
                                            Array.from(updatedSelected.values()).some(arr => arr.length > 0) ?
                                                fetchFilteredData(filterInfo as FilterSearchBody) :
                                                fetchPageData(paginationInfo);
                                        } catch (error) {
                                            console.error('Filter search failed:', error);
                                        }
                                    }}
                                >
                                    <Checkbox
                                        checked={filterLutSected.get(filterColumnHeaderSelected)?.includes(option.label) || false}
                                        className="pointer-events-none size-4.5 sm:size-4.5 lg:size-4.5"
                                    />
                                    <Label
                                        htmlFor={option.label}
                                        className="text-sm sm:text-base cursor-pointer flex select-none"
                                        style={{
                                            color: filterLutSected.get(filterColumnHeaderSelected)?.includes(option.label) ? "#2563eb" : "#222",
                                            fontWeight: filterLutSected.get(filterColumnHeaderSelected)?.includes(option.label) ? 700 : 500,
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

export default FilterLut;
