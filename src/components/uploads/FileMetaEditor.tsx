import { useFileToggleStore, useFileUploadStore } from "@/stores/useFileInputStore";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { memo, useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { Separator } from "../ui/separator";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuLabel,
} from "../ui/context-menu";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useColumnsStore } from "@/stores/useColumnsStore";
import { createLutOptionsFromMapColumns, getMatchedLutOptions } from "@/handlers/events/lut.config.handler";
import { isFieldRequired } from "@/models/requiredValueModel";

const FileMetaEditor = memo(() => {
    const file = useFileUploadStore((state) => state.selectedFiles);
    const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
    const setFileMetadata = useFileMetaDataStore((state) => state.setFileMetadata);
    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const mapColumns = useColumnsStore((state) => state.mapColumns);
    const lutRules = useColumnsStore((state) => state.lutRules);
    const lutMapOptions = createLutOptionsFromMapColumns(mapColumns);

    const sortedMapColumns = [
        ...mapColumns.filter(col => col.columnName === "deliverableType"),
        ...mapColumns.filter(col => col.columnName === "testClassification"),
        ...mapColumns.filter(
            col =>
                col.propertyType !== "SERVER_MANAGED" &&
                col.columnName !== "deliverableType" &&
                col.columnName !== "testClassification" &&
                col.columnName !== "description"
        ),
        ...mapColumns.filter(col => col.columnName === "description"),
    ];

    const isFieldRequiredForCurrentSelection = (fieldName: string) => {
        const deliverableType = fileMetadata[selectedFileIndex]?.deliverableType;
        const testClassification = fileMetadata[selectedFileIndex]?.testClassification;

        // const tempFieldName = fieldName.toLowerCase().replace(/\s+/g, '');

        if (!deliverableType || !testClassification) {
            if (fieldName === "deliverableType" || fieldName === "testClassification") {
                return true;
            }
            return false;
        }

        return isFieldRequired(Number(deliverableType), Number(testClassification), fieldName);
    };

    const getLutOptions = (columnName: string) => {
        const deliverableTypeLut = fileMetadata[selectedFileIndex]?.deliverableType;
        const testClassificationLut = fileMetadata[selectedFileIndex]?.testClassification;
        if (columnName === "testResult" && deliverableTypeLut) {
            return getMatchedLutOptions(lutRules, lutMapOptions, columnName, Number(deliverableTypeLut));
        }

        if (columnName === "testItem" && testClassificationLut) {
            return getMatchedLutOptions(lutRules, lutMapOptions, columnName, Number(testClassificationLut));
        }
        return lutMapOptions[columnName] || [];
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
                    <div className="space-y-4 pr-2 pb-6">
                        {isFolderMode && (
                            <>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-2">
                                    <div>
                                        <Label className="text-left font-bold text-xl mb-2 text-blue-600">그룹 속성</Label>
                                    </div>
                                    <div>
                                        <Label className="text-left font-bold text-lg mb-1 text-gray-800">그룹 이름</Label>
                                        <Input
                                            className="mb-4 !text-base w-full !h-12 rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                                            placeholder="그룹 이름 입력"
                                            style={{ fontSize: "18px" }}
                                            value={fileMetadata[selectedFileIndex]?.groupName || ""}
                                            onChange={(e) => {
                                                setFileMetadata(selectedFileIndex, { groupName: e.target.value });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-left font-bold text-lg mb-1 text-gray-800">그룹 설명</Label>
                                        <Textarea
                                            className="h-25 resize-none !text-base w-full rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                                            placeholder="그룹 설명 입력..."
                                            style={{ fontSize: "18px" }}
                                            value={fileMetadata[selectedFileIndex]?.groupDescription || ""}
                                            onChange={(e) => {
                                                setFileMetadata(selectedFileIndex, { groupDescription: e.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                                <Separator className="h-0.5 bg-gray-300 opacity-100 my-4 mb-2" />
                            </>
                        )}
                        {sortedMapColumns.map((col) => (
                            <div key={col.columnName}>
                                <Label className="text-left text-gray-500 font-medium text-lg mb-1">{col.displayName}</Label>
                                {(() => {
                                    if (col.columnName === "description") {
                                        return (
                                            <Textarea
                                                className={`h-25 resize-none border rounded-md px-3 py-2 transition-colors duration-150
                                                    ${isFieldRequiredForCurrentSelection(col.columnName)
                                                        ? "border-red-400 border-2"
                                                        : "border-gray-300"
                                                    }`}
                                                value={fileMetadata[selectedFileIndex]?.[col.columnName] || ""}
                                                onChange={(e) => {
                                                    if (col.propertyType === "USER_DEFINED") {
                                                        setFileMetadata(selectedFileIndex, { ["customMetadata"]: { [col.columnName]: e.target.value } });
                                                    }
                                                    setFileMetadata(selectedFileIndex, { [col.columnName]: e.target.value })
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
                                                            value={(() => {
                                                                const storedValue = fileMetadata[selectedFileIndex]?.[col.columnName];
                                                                if (!storedValue) return "";

                                                                const matchingOptionById = getLutOptions(col.columnName)?.find(option => option.id === storedValue);
                                                                if (matchingOptionById) return storedValue;

                                                                const matchingOptionByLabel = getLutOptions(col.columnName)?.find(option => option.lutValue === storedValue);
                                                                if (matchingOptionByLabel) return matchingOptionByLabel.id;

                                                                return storedValue;
                                                            })()}
                                                            onValueChange={(value) => {
                                                                if (col.propertyType === "USER_DEFINED") {
                                                                    setFileMetadata(selectedFileIndex, { ["customMetadata"]: { [col.columnName]: value } });
                                                                }
                                                                setFileMetadata(selectedFileIndex, { [col.columnName]: value })
                                                            }}
                                                        >
                                                            <SelectTrigger className={`w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 
                                                                ${isFieldRequiredForCurrentSelection(col.columnName)
                                                                    ? "border-red-400 border-2"
                                                                    : "border-gray-300"
                                                                }`}>
                                                                <span className="text-lg font-medium">
                                                                    <SelectValue />
                                                                </span>
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                                                                <ScrollArea className="h-[210px]" type="auto">
                                                                    {getLutOptions(col.columnName)?.map((option) => (
                                                                        <SelectItem
                                                                            key={option.id}
                                                                            value={option.id.toString()}
                                                                            className="text-lg font-medium px-3 py-3 bg-white hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 cursor-pointer"
                                                                        >
                                                                            {option.lutValue}
                                                                        </SelectItem>
                                                                    ))}
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className="w-50 truncate max-w-full text-center bg-white border border-gray-300 rounded-md shadow-lg">
                                                    <ContextMenuLabel className="font-bold text-base text-sky-800 px-3 py-2">
                                                        {col.displayName}
                                                    </ContextMenuLabel>
                                                    <ContextMenuSeparator className="bg-gray-200 h-0.5" />
                                                    <ContextMenuItem
                                                        className="h-10 cursor-pointer font-bold text-sm flex items-center gap-2 py-2 hover:bg-blue-50 transition-colors duration-150 pl-12"
                                                        onClick={() => {
                                                            if (col.propertyType === "USER_DEFINED") {
                                                                setFileMetadata(selectedFileIndex, { ["customMetadata"]: "" });
                                                            }
                                                            setFileMetadata(selectedFileIndex, { [col.columnName]: "" });
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
                                                value={fileMetadata[selectedFileIndex]?.[col.columnName] || ""}
                                                onChange={(e) => {
                                                    if (col.propertyType === "USER_DEFINED") {
                                                        setFileMetadata(selectedFileIndex, { ["customMetadata"]: { [col.columnName]: e.target.value } });
                                                    }
                                                    setFileMetadata(selectedFileIndex, { [col.columnName]: e.target.value })
                                                }}
                                                className={`h-12 border rounded-md px-3 py-2 transition-colors duration-150 font-medium text-base
                                                    ${isFieldRequiredForCurrentSelection(col.columnName)
                                                        ? "border-red-400 border-2"
                                                        : "border-gray-300"
                                                    }`}
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