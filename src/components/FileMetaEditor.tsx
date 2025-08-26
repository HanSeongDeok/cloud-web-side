import { useFileToggleStore, useFileUploadStore } from "@/stores/useFileInputStore";
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
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuLabel,
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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const FileMetaEditor = memo(() => {
    const file = useFileUploadStore((state) => state.selectedFiles);
    const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
    const setFileMetadata = useFileMetaDataStore((state) => state.setFileMetadata);
    const clearFileMetadata = useFileMetaDataStore((state) => state.clearFileMetadata);
    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);

    const handleResetDeliverableType = () => {
        const currentMetadata = fileMetadata[selectedFileIndex];
        if (currentMetadata) {
            const { deliverableType, ...restMetadata } = currentMetadata;
            clearFileMetadata(selectedFileIndex);
            setFileMetadata(selectedFileIndex, restMetadata);
        }
    };

    const handleResetTestClassification = () => {
        const currentMetadata = fileMetadata[selectedFileIndex];
        if (currentMetadata) {
            const { testClassification, ...restMetadata } = currentMetadata;
            clearFileMetadata(selectedFileIndex);
            setFileMetadata(selectedFileIndex, restMetadata);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-2 flex items-center gap-2">
                <Label className="mt-1 font-bold text-blue-500 text-left text-lg whitespace-nowrap">선택 파일: </Label>
                <Label
                    className="font-bold text-left text-xl truncate block"
                >
                    {file[selectedFileIndex]?.name}
                </Label>
            </div>
            <Separator className="h-0.5 bg-gray-300 opacity-100 my-2 mb-4" />
            <div className="flex-1 overflow-auto">
                <ScrollArea
                    className="h-full pr-4"
                    type="auto"
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="space-y-4 pr-2">
                        {isFolderMode && (
                            <>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-2">
                                    <div>
                                        <Label className="text-left font-bold text-xl mb-2 text-blue-600">Group Properties</Label>
                                    </div>
                                    <div>
                                        <Label className="text-left font-bold text-lg mb-1">Group Name</Label>
                                        <Input
                                            className="mb-4"
                                            placeholder="Enter group name"
                                            value={""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-left font-bold text-lg mb-1">Group Description</Label>
                                        <Textarea
                                            className="h-25 resize-none"
                                            placeholder="Enter description..."
                                        />
                                    </div>
                                </div>
                                <Separator className="h-0.5 bg-gray-300 opacity-100 my-4 mb-2" />
                            </>
                        )}
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
                                <ContextMenuContent className="w-38 truncate max-w-full text-left">
                                    <ContextMenuLabel>DeliverableType</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                        className="h-8 cursor-pointer font-bold text-sm flex items-center gap-2 px-3"
                                        onClick={handleResetDeliverableType}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        초기화
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">TestClassification</Label>
                            <ContextMenu>
                                <ContextMenuTrigger asChild>
                                    <div>
                                        <Select
                                            value={fileMetadata[selectedFileIndex]?.testClassification || ""}
                                            onValueChange={(value) => setFileMetadata(selectedFileIndex, { testClassification: value })}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select TestClassification" />
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
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-38 truncate max-w-full text-left">
                                    <ContextMenuLabel>TestClassification</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                            className="h-8 cursor-pointer font-bold text-sm flex items-center gap-2 px-3"
                                            onClick={handleResetTestClassification}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        초기화
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">Vehicle</Label>
                            <Select
                                value={fileMetadata[selectedFileIndex]?.vehicle || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { vehicle: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Vehicle" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.driveType || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { driveType: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select DriveType" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.devStep || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { devStep: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select DevStep" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.ecu || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { ecu: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select ECU" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.testItem || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { testItem: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select TestItem" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.result || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { result: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Result" />
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
                            <Select
                                value={fileMetadata[selectedFileIndex]?.memType || ""}
                                onValueChange={(value) => setFileMetadata(selectedFileIndex, { memType: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select MemType" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[65px]">
                                        {memTypeOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">TcNumber</Label>
                            <Input
                                placeholder="Type TcNumber"
                                value={fileMetadata[selectedFileIndex]?.tcNumber || ""}
                                onChange={(e) => setFileMetadata(selectedFileIndex, { tcNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">SwVersion</Label>
                            <Input
                                placeholder="Type SwVersion"
                                value={fileMetadata[selectedFileIndex]?.swVersion || ""}
                                onChange={(e) => setFileMetadata(selectedFileIndex, { swVersion: e.target.value })}
                            />
                        </div>
                        <div    >
                            <Label className="text-left font-bold text-lg mb-1">DepArr</Label>
                            <Input
                                placeholder="Type DepArr"
                                value={fileMetadata[selectedFileIndex]?.deparr || ""}
                                onChange={(e) => setFileMetadata(selectedFileIndex, { deparr: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className="text-left font-bold text-lg mb-1">Description</Label>
                            <Textarea
                                className="h-25 resize-none"
                                value={fileMetadata[selectedFileIndex]?.description || ""}
                                onChange={(e) => setFileMetadata(selectedFileIndex, { description: e.target.value })}
                                placeholder="Enter description..."
                            />
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

export default FileMetaEditor;