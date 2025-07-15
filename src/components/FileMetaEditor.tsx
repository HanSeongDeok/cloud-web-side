import { useFileUploadStore } from "@/stores/useFileInputStore";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { memo } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { Separator } from "./ui/separator";
import { usePannelResizableStore } from "@/stores/usePannelResizableStroe";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const FileMetaEditor = memo(() => {
    const file = useFileUploadStore((state) => state.selectedFiles);
    const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
    const rightLabelWidth = usePannelResizableStore((state) => state.getRightLabelWidth());
    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-2 flex items-center gap-2">
                <span className="font-bold text-blue-500 text-left text-lg whitespace-nowrap">메타데이터 편집: </span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className="font-bold text-left text-2xl truncate block"
                                style={{ maxWidth: `${rightLabelWidth}px` }}
                            >
                                {file[selectedFileIndex]?.name}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{file[selectedFileIndex]?.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Separator className="my-2 mb-2" />
            <div className="grid grid-cols-2 gap-4">
                <ScrollArea className="w-full h-100">
                    <div>
                        <Label className="block mb-1">Vehicle</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kona Electric">Kona Electric</SelectItem>
                                <SelectItem value="EV6">EV6</SelectItem>
                                <SelectItem value="GV80">GV80</SelectItem>
                                <SelectItem value="IONIQ 6">IONIQ 6</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

export default FileMetaEditor;