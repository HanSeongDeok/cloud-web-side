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
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuLabel,
    ContextMenuShortcut,
} from "./ui/context-menu";
import { 
    vehicleOptions, 
    deliverableTypeOptions, 
    testClassificationOptions, 
    driveTypeOptions, 
    ecuOptions, 
    stepOptions, 
    testItemOptions, 
    resultOptions, 
    memTypeOptions 
} from "@/models/multiSelectModel";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { RotateCcw } from "lucide-react";

const FileMetaEditor = memo(() => {
    const file = useFileUploadStore((state) => state.selectedFiles);
    const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
    const setFileMetadata = useFileMetaDataStore((state) => state.setFileMetadata);

    const handleResetDeliverableType = () => {
        setFileMetadata(selectedFileIndex, { deliverableType: "" });
    };

    return (
        <div className="flex flex-col h-full w-full" onContextMenu={(e) => {e.preventDefault()}}>
            <div className="mb-2 flex items-center gap-2">
                <Label className="mt-1 font-bold text-blue-500 text-left text-lg whitespace-nowrap">메타데이터 편집: </Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Label
                                className="font-bold text-left text-2xl truncate block"
                            >
                                {file[selectedFileIndex]?.name}
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{file[selectedFileIndex]?.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Separator className="my-2 mb-2" />
            <div className="grid gap-4">
                <ScrollArea className="w-full h-120">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">DeliverableType</Label>
                            <ContextMenu>
                                <ContextMenuTrigger asChild>
                                    <div>
                                        <Select 
                                            value={fileMetadata[selectedFileIndex]?.deliverableType || ""} 
                                            onValueChange={(value) => setFileMetadata(selectedFileIndex, { deliverableType: value })}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select DeliverableType" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <ScrollArea className="h-[100px]">
                                                    {deliverableTypeOptions.map((option) => (
                                                        <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                                    ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuLabel>DeliverableType</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={handleResetDeliverableType}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        초기화
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">TestClassification</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="TestClassification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {testClassificationOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">Vehicle</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {vehicleOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">DriveType</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="DriveType" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {driveTypeOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">DevStep</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="DevStep" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {stepOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">ECU</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="ECU" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {ecuOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">TestItem</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="TestItem" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {testItemOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">Result</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Result" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {resultOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">MemType</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="MemType" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[130px]">
                                        {memTypeOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

export default FileMetaEditor;