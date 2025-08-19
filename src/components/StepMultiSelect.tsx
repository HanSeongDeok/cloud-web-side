import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStepSelectionStore } from "@/stores/useSelectionStore";
import { stepOptions } from "@/models/multiSelectModel";

const StepMultiSelect = memo(() => {
    const selected = useStepSelectionStore((state) => state.selected);
    const setSelected = useStepSelectionStore((state) => state.setSelected);
    const selectAll = () => {
        setSelected(selected.length === stepOptions.length ? 
            [] : 
            stepOptions.map(option => option.id));
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-45 sm:w-45 lg:w-45 h-12 sm:h-12 lg:h-12 justify-between text-sm sm:text-base cursor-pointer bg-gray-100/30 hover:bg-gray-100 transition-colors border border-gray-300 hover:border-gray-400">
                    <span className="font-bold truncate">
                        단계 선택
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-45 sm:w-45 lg:w-45 p-2 bg-gray-50 border border-gray-400">
                <div className="flex flex-col space-y-1">
                    <div
                        className={`flex items-center gap-2 sm:gap-3 px-2 py-1 rounded cursor-pointer transition-colors 
                            ${selected.length === stepOptions.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={selected.length === stepOptions.length}
                            onCheckedChange={selectAll}
                            className="pointer-events-none size-5 sm:size-5 lg:size-5"
                        />
                        <span className="text-base sm:text-base font-bold pl-1">All</span>
                    </div>
                    <Separator className="h-0.5 bg-gray-300 opacity-100"/>
                    <ScrollArea className="h-[120px] sm:h-[150px]">
                        <div className="flex flex-col space-y-1 font-bold pr-2">
                            {stepOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center gap-2 sm:gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold 
                                        ${selected.includes(option.id)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={() => setSelected(selected.includes(option.id) ? 
                                        selected.filter((item) => item !== option.id) : 
                                        [...selected, option.id])}
                                >
                                    <Checkbox
                                        checked={selected.includes(option.id)}
                                        onCheckedChange={() => setSelected(selected.includes(option.id) ? 
                                            selected.filter((item) => item !== option.id) : 
                                            [...selected, option.id])}
                                        className="pointer-events-none size-5 sm:size-5 lg:size-5"
                                    />
                                    <span className="text-sm sm:text-base pl-1">{option.label}</span>
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
