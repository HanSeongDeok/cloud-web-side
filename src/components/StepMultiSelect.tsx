import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const options = [
    { id: "step1", label: "Step 1" },
    { id: "step2", label: "Step 2" },
    { id: "step3", label: "Step 3" },
    { id: "step4", label: "Step 4" },
    { id: "step5", label: "Step 5" },
    { id: "step6", label: "Step 6" },
    { id: "step7", label: "Step 7" },
    { id: "step8", label: "Step 8" },
];

interface StepMultiSelectProps {
    selected: string[];
    setSelected: (selected: string[]) => void;
}

const StepMultiSelect = memo(({ selected, setSelected }: StepMultiSelectProps) => {
    const toggleOption = (id: string) => {
        setSelected(
            selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
        );
    };

    const selectAll = () => {
        setSelected(selected.length === options.length ? [] : options.map(option => option.id));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] h-12 justify-between">
                    <span className="text-base font-bold">
                        단계 선택
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                <div className="flex flex-col space-y-1">
                    <div
                        className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors ${selected.length === options.length
                                ? "bg-primary/10"
                                : "hover:bg-accent/50"
                            }`}
                        onClick={selectAll}
                    >
                        <Checkbox
                            checked={selected.length === options.length}
                            onCheckedChange={selectAll}
                            className="pointer-events-none size-4"
                        />
                        <span className="text-base font-bold pl-1">All</span>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[150px]">
                        <div className="flex flex-col space-y-1 font-bold">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer transition-colors font-bold ${selected.includes(option.id)
                                            ? "bg-primary/10"
                                            : "hover:bg-accent/50"
                                        }`}
                                    onClick={() => toggleOption(option.id)}
                                >
                                    <Checkbox
                                        checked={selected.includes(option.id)}
                                        onCheckedChange={() => toggleOption(option.id)}
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

export default StepMultiSelect;

