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
    lutOptions,
} from "@/models/multiSelectModel";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useColumnsStore } from "@/stores/useColumnsStore";

const FileMetaEditor = memo(() => {
    const file = useFileUploadStore((state) => state.selectedFiles);
    const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
    const setFileMetadata = useFileMetaDataStore((state) => state.setFileMetadata);
    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const mapColumns = useColumnsStore((state) => state.mapColumns);

    const sortedMapColumns = [
        ...mapColumns.filter(col => col.originalName === "deliverabletype"),
        ...mapColumns.filter(col => col.originalName === "testclassification"),
        ...mapColumns.filter(
            col =>
                col.propertyType !== "SERVER_MANAGED" &&
                col.originalName !== "deliverabletype" &&
                col.originalName !== "testclassification" &&
                col.originalName !== "description"
        ),
        ...mapColumns.filter(col => col.originalName === "description"),
    ];

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
                    <div className="space-y-4 pr-2 pb-6">
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
                                            style={{ fontSize: "18px" }}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-left font-bold text-lg mb-1">Group Description</Label>
                                        <Textarea
                                            className="h-25 resize-none"
                                            placeholder="Enter description..."
                                            style={{ fontSize: "18px" }}
                                        />
                                    </div>
                                </div>
                                <Separator className="h-0.5 bg-gray-300 opacity-100 my-4 mb-2" />
                            </>
                        )}
                        {sortedMapColumns.map((col) => (
                            <div key={col.originalName}>
                                <Label className="text-left text-gray-500 font-medium text-lg mb-1">{col.displayName}</Label>
                                {(() => {
                                    if (col.originalName === "description") {
                                        return (
                                            <Textarea
                                                className="h-25 resize-none border border-gray-300 rounded-md px-3 py-2 transition-colors duration-150"
                                                value={fileMetadata[selectedFileIndex]?.[col.originalName] || ""}
                                                onChange={(e) =>{
                                                    if (col.propertyType === "USER_DEFINED") {
                                                        setFileMetadata(selectedFileIndex, {["customMetadata"]: {[col.originalName]: e.target.value}});
                                                    }
                                                    setFileMetadata(selectedFileIndex, { [col.originalName]: e.target.value })
                                                }}
                                                style={{ fontSize: "18px" }}
                                            />
                                        );
                                    } else if (col.useLut) {
                                        return (
                                            <ContextMenu>
                                                <ContextMenuTrigger asChild>
                                                    <div>
                                                        <Select
                                                            value={fileMetadata[selectedFileIndex]?.[col.originalName] || ""}
                                                            onValueChange={(value) =>{
                                                                if (col.propertyType === "USER_DEFINED") {
                                                                    setFileMetadata(selectedFileIndex, {["customMetadata"]: {[col.originalName]: value}});
                                                                }
                                                                setFileMetadata(selectedFileIndex, { [col.originalName]: value })
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full border border-gray-300 !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150">
                                                                <span className="text-lg font-medium">
                                                                    <SelectValue />
                                                                </span>
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                                                                <ScrollArea className="h-[210px]" type="auto">
                                                                    {lutOptions[col.originalName]?.map((option) => (
                                                                        <SelectItem
                                                                            key={option.id}
                                                                            value={option.id}
                                                                            className="text-lg font-medium px-3 py-3 bg-white hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 cursor-pointer"
                                                                        >
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className="w-50 truncate max-w-full text-center bg-white border border-gray-300 rounded-md shadow-lg">
                                                    <ContextMenuLabel className="font-bold text-base text-gray-800 px-3 py-2">
                                                        {col.displayName}
                                                    </ContextMenuLabel>
                                                    <ContextMenuSeparator className="bg-gray-200 h-0.5" />
                                                    <ContextMenuItem
                                                        className="h-10 cursor-pointer font-bold text-sm flex items-center gap-2 py-2 hover:bg-blue-50 transition-colors duration-150 pl-12"
                                                        onClick={() => {
                                                            if (col.propertyType === "USER_DEFINED") {
                                                                setFileMetadata(selectedFileIndex, {["customMetadata"]: ""});
                                                            }
                                                            setFileMetadata(selectedFileIndex, { [col.originalName]: "" });
                                                        }}
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4 text-gray-600" />
                                                        <span className="text-gray-700">초기화</span>
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        );
                                    } else {
                                        return (
                                            <Input
                                                placeholder={`...`}
                                                value={fileMetadata[selectedFileIndex]?.[col.originalName] || ""}
                                                onChange={(e) => {
                                                    if (col.propertyType === "USER_DEFINED") {
                                                        setFileMetadata(selectedFileIndex, {["customMetadata"]: {[col.originalName]: e.target.value}});
                                                    }
                                                    setFileMetadata(selectedFileIndex, { [col.originalName]: e.target.value })
                                                }}
                                                className="h-12 border border-gray-300 rounded-md px-3 py-2 transition-colors duration-150 font-medium text-base"
                                                style={{ fontSize: "18px" }}
                                            />
                                        );
                                    }
                                })()}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

export default FileMetaEditor;