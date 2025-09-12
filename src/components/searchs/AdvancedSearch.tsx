import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Filter, RefreshCcw, RotateCcw, X } from "lucide-react";
import { Badge } from "@components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuLabel,
} from "@components/ui/context-menu";
import { useColumnsStore } from "@/stores/useColumnsStore";
import { lutOptions } from "@/models/multiSelectModel";
import { useAdvancedSearchStore } from "@/stores/useAdvancedSearchStore";
import { DateSearchForm } from "./DateSearchForm";
import { useFilterAdvancedSelectionStore, useFilterLutSelectionStore } from "@/stores/useSelectionStore";
import { Checkbox } from "@components/ui/checkbox";

const AdvancedSearch = () => {
    const mapColumns = useColumnsStore((state) => state.mapColumns);
    // const setAdvancedSearch = useAdvancedSearchStore((state) => state.setAdvancedSearch);
    const clearAllAdvancedSearch = useAdvancedSearchStore((state) => state.clearAllAdvancedSearch);

    const [isOpen, setIsOpen] = useState(false);
    const [fileType, setFileType] = useState("all");
    const [uploader, setUploader] = useState("");
    const [fileName, setFileName] = useState("");

    // FileMetaEditor와 동일한 컬럼 정렬 로직
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

    // LUT 옵션 가져오기 함수
    const getLutOptions = (key: string) => {
        return lutOptions[key] || [];
    };

    const handleReset = () => {
        setFileType("");
        setUploader("");
        setFileName("");
        setStartDate(undefined);
        setEndDate(undefined);
        clearAllAdvancedSearch();
    };

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const handleAdvancedSearch = async () => {
        console.log("Advanced search");
    }

    const handleCancel = () => {
        handleReset();
        setIsOpen(false);
    }

    const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
    const filterAdvancedSelected = useFilterAdvancedSelectionStore((state) => state.selected);
    const setFilterAdvancedSelected = useFilterAdvancedSelectionStore((state) => state.setSelected);

    useEffect(() => {
        const newMap = new Map<string, string[]>();
        filterLutSected.forEach((value, key) => {
            newMap.set(key, Array.isArray(value) ? [...value] : []);
        });
        setFilterAdvancedSelected(newMap);
    }, [filterLutSected, setFilterAdvancedSelected]);

    const selectAll = (key: string) => {
        if (!key) return;
        setFilterAdvancedSelected(filterAdvancedSelected.get(key)?.length === getLutOptions(key)?.length ?
            new Map(filterAdvancedSelected).set(key, []) :
            new Map(filterAdvancedSelected).set(key, getLutOptions(key)?.map(option => option.label)));
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 cursor-pointer"
                >
                    <Filter className="!h-5 !w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col resize overflow-hidden border-2 border-blue-200 rounded-lg shadow-lg bg-white"
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                }}
                style={{
                    width: 'clamp(500px, 40vw, 1500px)',
                    height: 'clamp(700px, 90vh, 1200px)',
                    minWidth: 500,
                    minHeight: 700,
                    maxWidth: '40vw',
                    maxHeight: '90vh',
                }}>
                {/* 헤더 영역 */}
                <div className="pb-2">
                    <DialogHeader>
                        <DialogTitle>고급 검색 기능</DialogTitle>
                        <DialogDescription>
                            데이터를 필터링하기 위한 조건을 설정하세요.
                        </DialogDescription>
                        <Label className="text-sky-700 font-bold text-lg"> 파일 필터 </Label>
                    </DialogHeader>
                    <Separator className="mt-4 h-0.5 bg-gray-500/50" />
                </div>

                {/* 스크롤 영역 */}
                <div className="flex-1 overflow-y-auto px-2 min-h-0 scrollbar">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-2">
                            <div className="col-span-4">
                                <Label htmlFor="fileType" className="mb-2 block text-left ml-1 text-base font-bold text-gray-800">타입</Label>
                                <Select value={fileType} onValueChange={setFileType}>
                                    <SelectTrigger id="fileType" className="text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300">
                                        <SelectValue placeholder="파일 타입 선택" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                                        <SelectItem value="all" className="font-medium text-base cursor-pointer hover:bg-blue-50">모두</SelectItem>
                                        <SelectItem value="folder" className="font-medium text-base cursor-pointer hover:bg-blue-50">그룹</SelectItem>
                                        <SelectItem value="file" className="font-medium text-base cursor-pointer hover:bg-blue-50">파일</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-2 mt-1">
                            <Label className="col-span-4  text-left ml-1 text-base font-bold text-gray-800">업로더</Label>
                            <div className="col-span-4">
                                <Input
                                    type="text"
                                    value={uploader}
                                    onChange={(e) => setUploader(e.target.value)}
                                    placeholder="업로더 이름 입력"
                                    className="!text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                                />
                            </div>
                        </div>

                        {(fileType === "all" || fileType === "file") && (
                            <div className="grid grid-cols-4 items-center gap-2 mt-1">
                                <Label className="col-span-4 mb-1 text-left ml-1 text-base font-bold text-gray-800">파일 이름</Label>
                                <div className="col-span-4">
                                    <Input
                                        type="text"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        placeholder="파일 이름 입력"
                                        className="!text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                                    />
                                </div>
                            </div>
                        )}

                        <DateSearchForm
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                        />

                        <Separator className="mt-8 mb-4 h-0.5 bg-gray-500/50" />

                        {/* fileType이 "all"일 때 파일 메타데이터 그룹 정보 표시 */}
                        {(fileType === "all" || fileType === "folder") && (
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
                        )}

                        {/* AdvancedSearch 컬럼들 */}
                        {(fileType === "all" || fileType === "file") && (
                            <div className="space-y-4 pr-2 pb-6">
                                {sortedMapColumns.map((col) => (
                                    <div key={col.columnName}>
                                        <Label className="text-left text-gray-500 font-medium text-lg mb-1">{col.displayName}</Label>
                                        {(() => {
                                            if (col.columnName === "description") {
                                                return (
                                                    <Textarea
                                                        placeholder={`...`}
                                                        className={`h-25 resize-none border rounded-md px-3 py-2 transition-colors duration-150 border-gray-300 ${col.columnName === "description" ? "h-25" : "h-12"}`}
                                                        value={filterAdvancedSelected.get(col.columnName) || []}
                                                        onChange={(e) => {
                                                            setFilterAdvancedSelected(filterAdvancedSelected.get(col.columnName)?.includes(e.target.value) ?
                                                                new Map(filterAdvancedSelected).set(col.columnName, filterAdvancedSelected.get(col.columnName)?.filter((item) => item !== e.target.value) || []) :
                                                                new Map(filterAdvancedSelected).set(col.columnName, [...filterAdvancedSelected.get(col.columnName) || [], e.target.value]));
                                                        }}
                                                        style={{ fontSize: "18px" }}
                                                    />
                                                );
                                            } else if (col.useLut) {
                                                return (
                                                    <div className="relative">
                                                        <ContextMenu>
                                                            <ContextMenuTrigger asChild>
                                                                <div className="w-full">
                                                                    <Select>
                                                                        <SelectTrigger className={`group relative w-full min-h-12 h-auto cursor-pointer rounded-md px-3 py-2 pr-8 transition-colors duration-150 border border-gray-300`}>
                                                                            <ScrollArea
                                                                                className={`transition-[height] duration-200 ease-in-out h-full`}
                                                                                type="hover"
                                                                            >
                                                                                <div
                                                                                    data-column={col.columnName}
                                                                                    className="flex flex-wrap gap-2 items-center w-full"
                                                                                >
                                                                                    {(filterAdvancedSelected.get(col.columnName) || []).map((value, index) => (
                                                                                        <Badge
                                                                                            key={index}
                                                                                            variant="secondary"
                                                                                            className="text-sm font-bold px-1 flex items-center gap-1 bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 transition-colors"
                                                                                        >
                                                                                            {value}
                                                                                            {/* <X
                                                                                            className="h-3 w-3 cursor-pointer hover:text-blue-600"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                const arr = filterAdvancedSelected.get(col.columnName) ?? [];
                                                                                                const next = arr.filter((_, i) => i !== index);
                                                                                                setFilterAdvancedSelected(new Map(filterAdvancedSelected).set(col.columnName, next));
                                                                                            }}
                                                                                        /> */}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </ScrollArea>
                                                                        </SelectTrigger>
                                                                        <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                                                                            <div
                                                                                className={`flex items-center gap-2 sm:gap-3 px-1 py-1 rounded-lg cursor-pointer transition-colors mb-2
                                                                                 ${filterAdvancedSelected.get(col.columnName)?.length === getLutOptions(col.columnName)?.length
                                                                                        ? "bg-primary/10"
                                                                                        : "hover:bg-gray-200"
                                                                                    }`}
                                                                                onClick={() => selectAll(col.columnName)}
                                                                            >
                                                                                <Checkbox
                                                                                    checked={filterAdvancedSelected.get(col.columnName)?.length === lutOptions[col.columnName]?.length || false}
                                                                                    onCheckedChange={() => selectAll(col.columnName)}
                                                                                    className="pointer-events-none size-5 sm:size-5 lg:size-5 border-2 border-black bg-white shadow-sm  data-[state=checked]:border-black transition-all"
                                                                                />
                                                                                <Label
                                                                                    htmlFor={"all"}
                                                                                    className="text-base sm:text-base cursor-pointer flex-1 select-none font-bold"
                                                                                >
                                                                                    전체 선택
                                                                                </Label>
                                                                            </div>
                                                                            <Separator className="h-0.5 bg-gray-300 opacity-100" />
                                                                            <ScrollArea className="h-[210px]" type="auto">
                                                                                {getLutOptions(col.columnName)?.map((option: any) => (
                                                                                    <div
                                                                                        className={`flex items-center gap-2 sm:gap-3 px-1 py-1 rounded-lg cursor-pointer transition-colors mb-2
                                                                                         ${filterAdvancedSelected.get(col.columnName)?.includes(option.label)
                                                                                                ? "bg-primary/10"
                                                                                                : "hover:bg-gray-200"
                                                                                            }`}
                                                                                        onClick={() => {
                                                                                            setFilterAdvancedSelected(filterAdvancedSelected.get(col.columnName)?.includes(option.label) ?
                                                                                                new Map(filterAdvancedSelected).set(col.columnName, filterAdvancedSelected.get(col.columnName)?.filter((item) => item !== option.label) || []) :
                                                                                                new Map(filterAdvancedSelected).set(col.columnName, [...filterAdvancedSelected.get(col.columnName) || [], option.label]));
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            checked={filterAdvancedSelected.get(col.columnName)?.includes(option.label) || false}
                                                                                            className="pointer-events-none size-5 sm:size-5 lg:size-5 border-2 border-black bg-white shadow-sm  data-[state=checked]:border-black transition-all"
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={option.label}
                                                                                            className="text-sm sm:text-base cursor-pointer flex select-none"
                                                                                            style={{
                                                                                                color: filterAdvancedSelected.get(col.columnName)?.includes(option.label) ? "#2563eb" : "#222",
                                                                                                fontWeight: filterAdvancedSelected.get(col.columnName)?.includes(option.label) ? 700 : 500,
                                                                                                transition: "color 0.2s"
                                                                                            }}
                                                                                        >
                                                                                            {option.label}
                                                                                        </Label>
                                                                                    </div>
                                                                                ))}
                                                                            </ScrollArea>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </ContextMenuTrigger>
                                                            <ContextMenuContent className="w-120 truncate max-w-full text-center bg-white border border-gray-300 rounded-md shadow-lg">
                                                                <ContextMenuLabel className="font-bold text-base text-sky-800 px-3 py-2">
                                                                    {col.displayName}
                                                                </ContextMenuLabel>
                                                                <ContextMenuSeparator className="bg-gray-200 h-0.5" />
                                                                {/* 현재 선택된 배지들 표시 */}
                                                                <div className="px-3 py-2">
                                                                    <div className="flex flex-wrap gap-1 max-h-30 overflow-y-auto">
                                                                        {(filterAdvancedSelected.get(col.columnName) || []).length === 0 ? (
                                                                            <div className="flex flex-row items-center justify-center w-full gap-2">
                                                                                <span className="text-gray-400 text-xs px-2 py-1">선택 사항 없음</span>
                                                                            </div>
                                                                        ) : (
                                                                            (filterAdvancedSelected.get(col.columnName) || []).map((value, index) => (
                                                                                <Badge
                                                                                    key={index}
                                                                                    variant="secondary"
                                                                                    className="text-xs px-2 py-1 bg-blue-100 border-blue-200 text-blue-800"
                                                                                >
                                                                                    {value}
                                                                                </Badge>
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <ContextMenuSeparator className="bg-gray-200 h-0.5" />
                                                                <ContextMenuItem
                                                                    className="h-10 cursor-pointer font-bold text-sm flex items-center gap-2 py-2 hover:bg-blue-50 transition-colors duration-150 pl-12"
                                                                    onSelect={() => {
                                                                        setFilterAdvancedSelected(new Map(filterAdvancedSelected).set(col.columnName, []));
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row items-center justify-center w-full gap-2 pr-10">
                                                                        <RotateCcw className="h-4 w-4 text-gray-600" />
                                                                        <span className="text-gray-700">초기화</span>
                                                                    </div>
                                                                </ContextMenuItem>
                                                            </ContextMenuContent>
                                                        </ContextMenu>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <Input
                                                        placeholder={`...`}
                                                        // value={filterAdvancedSelected.get(col.columnName) || []}
                                                        // onChange={(e) => {
                                                        //     setFilterAdvancedSelected(filterAdvancedSelected.get(col.columnName)?.includes(e.target.value) ?
                                                        //         new Map(filterAdvancedSelected).set(col.columnName, filterAdvancedSelected.get(col.columnName)?.filter((item) => item !== e.target.value) || []) :
                                                        //         new Map(filterAdvancedSelected).set(col.columnName, [...filterAdvancedSelected.get(col.columnName) || [], e.target.value]));
                                                        // }}
                                                        className={`h-12 border rounded-md px-3 py-2 transition-colors duration-150 font-medium text-base
                                                        border-gray-300`}
                                                        style={{ fontSize: "18px" }}
                                                    />
                                                );
                                            }
                                        })()}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* 버튼 영역 */}
                <div className="h-20 bg-white px-6 flex items-center justify-between border-t border-gray-300">
                    <Button
                        className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 mt-4 cursor-pointer"
                        variant="default"
                        onClick={handleReset}>
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        초기화
                    </Button>
                    <div className="flex gap-2 mt-4">
                        <Button className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer" variant="default" onClick={handleCancel}>취소</Button>
                        <Button className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer" variant="default" onClick={handleAdvancedSearch}>필터 검색</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdvancedSearch;
