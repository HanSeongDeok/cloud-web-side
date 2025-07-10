
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEcuSelectionStore } from "@/stores/useSelectionStore";
import { ecuOptions } from "@/models/multiSelectModel";

const ECUTypeMultiSelect = memo(() => {
    const selected = useEcuSelectionStore((state) => state.selected);
    const setSelected = useEcuSelectionStore((state) => state.setSelected);
    const selectAll = () => {
        setSelected(selected.length === ecuOptions.length ? 
            [] : 
            ecuOptions.map(option => option.id));
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] h-12 justify-between">
                    <span className="text-base font-bold">
                        ECU 선택
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                <div className="flex flex-col space-y-1">
                    <div
                        className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors 
                            ${selected.length === ecuOptions.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={selected.length === ecuOptions.length}
                            onCheckedChange={selectAll}
                            className="pointer-events-none size-4"
                        />
                        <span className="text-base font-bold pl-1">All</span>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[150px]">
                        <div className="flex flex-col space-y-1 font-bold">
                            {ecuOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold 
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
                                        className="pointer-events-none size-4"
                                    />
                                    <span className="text-base pl-1">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
});

export default ECUTypeMultiSelect;

