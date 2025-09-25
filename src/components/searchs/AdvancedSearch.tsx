import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Filter, RefreshCcw, RotateCcw } from "lucide-react";
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
import {
  useFilterAdvancedSelectionStore,
  useFilterLutSelectionStore,
} from "@/stores/useSelectionStore";
import { Checkbox } from "@components/ui/checkbox";
import {
  SearchMode,
  createfilterInfo,
} from "@/handlers/events/filterSearch.service.handler";
import {
  useDataTableStore,
  type SearchInfoBody,
} from "@/stores/useTableDataStore";
import { useDash } from "@/stores/useDash";
import { createLutOptionsFromMapColumns } from "@/handlers/events/lut.config.handler";

const AdvancedSearch = ({ pageType }: { pageType: string }) => {
  const mapColumns = useColumnsStore((state) => state.mapColumns);
  // const setAdvancedSearch = useAdvancedSearchStore((state) => state.setAdvancedSearch);
  const clearAllAdvancedSearch = useAdvancedSearchStore(
    (state) => state.clearAllAdvancedSearch
  );
  const setSearchType = useAdvancedSearchStore((state) => state.setSearchType);
  const searchType = useAdvancedSearchStore((state) => state.searchType);
  const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);
  const fetchTrashData = useDataTableStore((state) => state.fetchTrashData);
  const setGlobalFilters = useDash((state) => state.setGlobalFilters);

  const [isOpen, setIsOpen] = useState(false);
  const [uploader, setUploader] = useState("");
  const [fileName, setFileName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [groupStartDate, setGroupStartDate] = useState<Date | undefined>();
  const [groupEndDate, setGroupEndDate] = useState<Date | undefined>();
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [dateRangeType, setDateRangeType] = useState<string>("전체");
  const [groupDateRangeType, setGroupDateRangeType] = useState<string>("전체");

  // FileMetaEditor와 동일한 컬럼 정렬 로직
  const sortedMapColumns = [
    ...mapColumns.filter((col) => col.columnName === "deliverableType"),
    ...mapColumns.filter((col) => col.columnName === "testClassification"),
    ...mapColumns.filter(
      (col) =>
        col.propertyType !== "SERVER_MANAGED" &&
        col.columnName !== "deliverableType" &&
        col.columnName !== "testClassification" &&
        col.columnName !== "description"
    ),
    ...mapColumns.filter((col) => col.columnName === "description"),
  ];

  // LUT 옵션 가져오기 함수
  // const getLutOptions = (key: string) => {
  //   return lutOptions[key] || [];
  // };

  const lutMapOptions = createLutOptionsFromMapColumns(mapColumns);
  const getLutOptions = (key: string) => {
    // const deliverableTypeLut = fileMetadata[selectedFileIndex]?.deliverableType;
    // const testClassificationLut = fileMetadata[selectedFileIndex]?.testClassification;
    // if (columnName === "testResult" && deliverableTypeLut) {
    //     return getMatchedLutOptions(lutRules, lutMapOptions, columnName, Number(deliverableTypeLut));
    // }

    // if (columnName === "testItem" && testClassificationLut) {
    //     return getMatchedLutOptions(lutRules, lutMapOptions, columnName, Number(testClassificationLut));
    // }
    return lutMapOptions[key] || [];
};

  const handleReset = () => {
    // setSearchType("ALL");
    setUploader("");
    setFileName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setGroupStartDate(undefined);
    setGroupEndDate(undefined);
    setGroupName("");
    setGroupDescription("");
    setDateRangeType("전체");
    setGroupDateRangeType("전체");
    clearAllAdvancedSearch();
  };

  const paginationInfo = useDataTableStore((state) => state.pagination);

  const handleAdvancedSearch = async () => {
    const newMap = new Map<string, string[]>();
    const advancedInfo = {
      searchType: searchType,
      uploader: uploader,
      ...(searchType === "ALL" || searchType === "FILE"
        ? { fileName: fileName }
        : {}),
      ...(searchType === "ALL" || searchType === "GROUP"
        ? {
          groupName: groupName,
          groupDescription: groupDescription,
        }
        : {}),
      ...(searchType === "ALL" || searchType === "FILE"
        ? {
          fileName: fileName,
          fileUploadedAt: {
            from: startDate?.toISOString().slice(0, 10),
            to: endDate?.toISOString().slice(0, 10),
          },
        }
        : {}),
      ...(searchType === "ALL" || searchType === "GROUP"
        ? {
          groupName: groupName,
          groupDescription: groupDescription,
          groupUploadAt: {
            from: groupStartDate?.toISOString().slice(0, 10),
            to: groupEndDate?.toISOString().slice(0, 10),
          },
        }
        : {}),
    };

    if (searchType && searchType.trim() !== "") {
      advancedInfo.searchType = searchType;
    }
    if (fileName && fileName.trim() !== "") {
      advancedInfo.fileName = fileName;
    }
    if (uploader && uploader.trim() !== "") {
      advancedInfo.uploader = uploader;
    }
    if (groupName && groupName.trim() !== "") {
      advancedInfo.groupName = groupName;
    }
    if (groupDescription && groupDescription.trim() !== "") {
      advancedInfo.groupDescription = groupDescription;
    }
    if (startDate || endDate) {
      advancedInfo.fileUploadedAt = {
        from: startDate?.toISOString().slice(0, 10),
        to: endDate?.toISOString().slice(0, 10),
      };
    }
    if (groupStartDate || groupEndDate) {
      advancedInfo.groupUploadAt = {
        from: groupStartDate?.toISOString().slice(0, 10),
        to: groupEndDate?.toISOString().slice(0, 10),
      };
    }

    // 파일 업로드 날짜(기간) 추가
    if (startDate || endDate) {
      const dateRangeObj: { from: string; to: string } = { from: "", to: "" };
      if (startDate) {
        const localStart = new Date(
          startDate.getTime() - startDate.getTimezoneOffset() * 60000
        );
        dateRangeObj.from = localStart.toISOString().slice(0, 10);
      }
      if (endDate) {
        const localEnd = new Date(
          endDate.getTime() - endDate.getTimezoneOffset() * 60000
        );
        dateRangeObj.to = localEnd.toISOString().slice(0, 10);
      }
      advancedInfo.fileUploadedAt = dateRangeObj;
    }
    filterAdvancedSelected.forEach((value, key) => {
      newMap.set(key, Array.isArray(value) ? [...value] : []);
    });
    setFilterLutSected(newMap);

    const searchInfo = createfilterInfo(
      newMap,
      paginationInfo,
      "",
      SearchMode.ADVANCED_SEARCH,
      advancedInfo
    );
    if (searchInfo) {
      const { paging, ...rest } = searchInfo;
      setGlobalFilters(rest);
      if (pageType === "storage") {
        fetchSearchData(searchInfo as SearchInfoBody);
      } else if (pageType === "trash") {
        fetchTrashData(searchInfo as SearchInfoBody);
      }
    }
    setIsOpen(false);
    handleReset();
  };

  const handleCancel = () => {
    handleReset();
    setIsOpen(false);
  };

  const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
  const filterAdvancedSelected = useFilterAdvancedSelectionStore(
    (state) => state.selected
  );

  const setFilterLutSected = useFilterLutSelectionStore(
    (state) => state.setSelected
  );
  const setFilterAdvancedSelected = useFilterAdvancedSelectionStore(
    (state) => state.setSelected
  );

  useEffect(() => {
    const newMap = new Map<string, string[]>();
    filterLutSected.forEach((value, key) => {
      newMap.set(key, Array.isArray(value) ? [...value] : []);
    });
    setFilterAdvancedSelected(newMap);
  }, [filterLutSected, setFilterAdvancedSelected]);

  // 날짜 범위 타입에 따른 자동 날짜 설정
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    const last90Days = new Date(today);
    last90Days.setDate(last90Days.getDate() - 90);

    switch (dateRangeType) {
      case "전체":
        setStartDate(undefined);
        setEndDate(undefined);
        break;
      case "오늘":
        setStartDate(today);
        setEndDate(today);
        break;
      case "어제":
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "지난 7일간":
        setStartDate(last7Days);
        setEndDate(today);
        break;
      case "지난 30일간":
        setStartDate(last30Days);
        setEndDate(today);
        break;
      case "지난 90일간":
        setStartDate(last90Days);
        setEndDate(today);
        break;
      case "사용자 지정 범위":
        break;
    }
  }, [dateRangeType]);

  const selectAll = (key: string) => {
    if (!key) return;
    setFilterAdvancedSelected(
      filterAdvancedSelected.get(key)?.length === getLutOptions(key)?.length
        ? new Map(filterAdvancedSelected).set(key, [])
        : new Map(filterAdvancedSelected).set(
          key,
          getLutOptions(key)?.map((option) => option.lutValue)
        )
    );
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
          width: "clamp(500px, 40vw, 1500px)",
          height: "clamp(700px, 90vh, 1200px)",
          minWidth: 500,
          minHeight: 700,
          maxWidth: "40vw",
          maxHeight: "90vh",
        }}
      >
        {/* 헤더 영역 */}
        <div className="pb-2">
          <DialogHeader>
            <DialogTitle>고급 검색 기능</DialogTitle>
            <DialogDescription>
              데이터를 필터링하기 위한 조건을 설정하세요.
            </DialogDescription>
            <Label className="text-sky-700 font-bold text-lg">
              {" "}
              파일 필터{" "}
            </Label>
          </DialogHeader>
          <Separator className="mt-4 h-0.5 bg-gray-500/50" />
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-2 min-h-0 scrollbar">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <div className="col-span-4">
                <Label
                  htmlFor="fileType"
                  className="mb-2 block text-left ml-1 text-base font-bold text-gray-800"
                >
                  타입
                </Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger
                    id="fileType"
                    className="text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                  >
                    <SelectValue placeholder="파일 타입 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                    <SelectItem
                      value="ALL"
                      className="font-medium text-base cursor-pointer hover:bg-blue-50"
                    >
                      모두
                    </SelectItem>
                    <SelectItem
                      value="GROUP"
                      className="font-medium text-base cursor-pointer hover:bg-blue-50"
                    >
                      그룹
                    </SelectItem>
                    <SelectItem
                      value="FILE"
                      className="font-medium text-base cursor-pointer hover:bg-blue-50"
                    >
                      파일
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-2 mt-1">
              <Label className="col-span-4  text-left ml-1 text-base font-bold text-gray-800">
                업로더
              </Label>
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

            {(searchType === "ALL" || searchType === "FILE") && (
              <div className="grid grid-cols-4 items-center gap-2 mt-1">
                <Label className="col-span-4 mb-1 text-left ml-1 text-base font-bold text-gray-800">
                  파일 이름
                </Label>
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

            {(searchType === "ALL" || searchType === "FILE") && (
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label className="col-span-4 text-left ml-1 text-base font-bold text-gray-800">
                  날짜 범위
                </Label>

                <div className="col-span-4">
                  <Select
                    value={dateRangeType}
                    onValueChange={setDateRangeType}
                  >
                    <SelectTrigger className="text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300">
                      <SelectValue placeholder="날짜 범위 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                      <SelectItem
                        value="전체"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        전체
                      </SelectItem>
                      <SelectItem
                        value="오늘"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        오늘
                      </SelectItem>
                      <SelectItem
                        value="어제"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        어제
                      </SelectItem>
                      <SelectItem
                        value="지난 7일간"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        지난 7일간
                      </SelectItem>
                      <SelectItem
                        value="지난 30일간"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        지난 30일간
                      </SelectItem>
                      <SelectItem
                        value="지난 90일간"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        지난 90일간
                      </SelectItem>
                      <SelectItem
                        value="사용자 지정 범위"
                        className="font-medium text-base cursor-pointer hover:bg-blue-50"
                      >
                        사용자 지정 범위
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {dateRangeType === "사용자 지정 범위" && (
              <DateSearchForm
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            )}

            <Separator className="mt-8 mb-4 h-0.5 bg-gray-500/50" />

            {/* fileType이 "all"일 때 파일 메타데이터 그룹 정보 표시 */}
            {(searchType === "ALL" || searchType === "GROUP") && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-2">
                <div>
                  <Label className="text-left font-bold text-xl mb-2 text-blue-600">
                    그룹 속성
                  </Label>
                </div>
                <div>
                  <Label className="text-left font-bold text-lg mb-1 text-gray-800">
                    그룹 이름
                  </Label>
                  <Input
                    className="mb-4 !text-base w-full !h-12 rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                    placeholder="그룹 이름 입력"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ fontSize: "18px" }}
                  />
                </div>
                <div>
                  <Label className="text-left font-bold text-lg mb-1 text-gray-800">
                    그룹 설명
                  </Label>
                  <Textarea
                    className="h-25 resize-none !text-base w-full rounded-md px-3 py-2 transition-colors duration-150 border-gray-300"
                    placeholder="설명 입력..."
                    style={{ fontSize: "18px" }}
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label className="col-span-4 text-left ml-1 text-lg font-bold text-gray-800">
                    날짜 범위
                  </Label>

                  <div className="col-span-4">
                    <Select
                      value={groupDateRangeType}
                      onValueChange={setGroupDateRangeType}
                    >
                      <SelectTrigger className="text-base w-full !h-12 cursor-pointer rounded-md px-3 py-2 transition-colors duration-150 border-gray-300">
                        <SelectValue placeholder="날짜 범위 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg ">
                        <SelectItem
                          value="전체"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          전체
                        </SelectItem>
                        <SelectItem
                          value="오늘"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          오늘
                        </SelectItem>
                        <SelectItem
                          value="어제"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          어제
                        </SelectItem>
                        <SelectItem
                          value="지난 7일간"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          지난 7일간
                        </SelectItem>
                        <SelectItem
                          value="지난 30일간"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          지난 30일간
                        </SelectItem>
                        <SelectItem
                          value="지난 90일간"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          지난 90일간
                        </SelectItem>
                        <SelectItem
                          value="사용자 지정 범위"
                          className="font-medium text-base cursor-pointer hover:bg-blue-50"
                        >
                          사용자 지정 범위
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {groupDateRangeType === "사용자 지정 범위" && (
                  <DateSearchForm
                    startDate={groupStartDate}
                    endDate={groupEndDate}
                    setStartDate={setGroupStartDate}
                    setEndDate={setGroupEndDate}
                  />
                )}
              </div>
            )}

            {/* AdvancedSearch 컬럼들 */}
            {(searchType === "ALL" || searchType === "FILE") && (
              <div className="space-y-4 pr-2 pb-6">
                {sortedMapColumns.map((col) => (
                  <div key={col.columnName}>
                    <Label className="text-left text-gray-500 font-medium text-lg mb-1">
                      {col.displayName}
                    </Label>
                    {(() => {
                      if (col.columnName === "description") {
                        return (
                          <Textarea
                            placeholder={`...`}
                            className={`h-25 resize-none border rounded-md px-3 py-2 transition-colors duration-150 border-gray-300 ${col.columnName === "description" ? "h-25" : "h-12"
                              }`}
                            value={
                              filterAdvancedSelected.get(col.columnName) || []
                            }
                            onChange={(e) => {
                              setFilterAdvancedSelected(
                                filterAdvancedSelected
                                  .get(col.columnName)
                                  ?.includes(e.target.value)
                                  ? new Map(filterAdvancedSelected).set(
                                    col.columnName,
                                    filterAdvancedSelected
                                      .get(col.columnName)
                                      ?.filter(
                                        (item) => item !== e.target.value
                                      ) || []
                                  )
                                  : new Map(filterAdvancedSelected).set(
                                    col.columnName,
                                    [
                                      ...(filterAdvancedSelected.get(
                                        col.columnName
                                      ) || []),
                                      e.target.value,
                                    ]
                                  )
                              );
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
                                    <SelectTrigger
                                      className={`group relative w-full min-h-12 h-auto cursor-pointer rounded-md px-3 py-2 pr-8 transition-colors duration-150 border border-gray-300`}
                                    >
                                      <ScrollArea
                                        className={`transition-[height] duration-200 ease-in-out h-full`}
                                        type="hover"
                                      >
                                        <div
                                          data-column={col.columnName}
                                          className="flex flex-wrap gap-2 items-center w-full"
                                        >
                                          {(
                                            filterAdvancedSelected.get(
                                              col.columnName
                                            ) || []
                                          ).map((value, index) => (
                                            <Badge
                                              key={`${col.columnName}-${value}-${index}`}
                                              variant="secondary"
                                              className="text-sm font-bold px-1 flex items-center gap-1 bg-neutral-800 border-neutral-900 text-gray-100"
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
                                                                                 ${filterAdvancedSelected.get(
                                          col.columnName
                                        )
                                            ?.length ===
                                            getLutOptions(
                                              col.columnName
                                            )
                                              ?.length
                                            ? "bg-primary/10"
                                            : "hover:bg-gray-200"
                                          }`}
                                        onClick={() =>
                                          selectAll(col.columnName)
                                        }
                                      >
                                        <Checkbox
                                          checked={
                                            filterAdvancedSelected.get(
                                              col.columnName
                                            )?.length ===
                                            lutOptions[col.columnName]
                                              ?.length || false
                                          }
                                          onCheckedChange={() =>
                                            selectAll(col.columnName)
                                          }
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
                                      <ScrollArea
                                        className="h-[210px]"
                                        type="auto"
                                      >
                                        {getLutOptions(col.columnName)?.map(
                                          (option: any, index: number) => (
                                            <div
                                              key={`${col.columnName}-option-${option.lutValue}-${index}`}
                                              className={`flex items-center gap-2 sm:gap-3 px-1 py-1 rounded-lg cursor-pointer transition-colors mb-2
                                                                                         ${filterAdvancedSelected
                                                  .get(
                                                    col.columnName
                                                  )
                                                  ?.includes(
                                                    option.lutValue
                                                  )
                                                  ? "bg-primary/10"
                                                  : "hover:bg-gray-200"
                                                }`}
                                              onClick={() => {
                                                setFilterAdvancedSelected(
                                                  filterAdvancedSelected
                                                    .get(col.columnName)
                                                    ?.includes(option.lutValue)
                                                    ? new Map(
                                                      filterAdvancedSelected
                                                    ).set(
                                                      col.columnName,
                                                      filterAdvancedSelected
                                                        .get(col.columnName)
                                                        ?.filter(
                                                          (item) =>
                                                            item !==
                                                            option.lutValue
                                                        ) || []
                                                    )
                                                    : new Map(
                                                      filterAdvancedSelected
                                                    ).set(col.columnName, [
                                                      ...(filterAdvancedSelected.get(
                                                        col.columnName
                                                      ) || []),
                                                      option.lutValue,
                                                    ])
                                                );
                                              }}
                                            >
                                              <Checkbox
                                                checked={
                                                  filterAdvancedSelected
                                                    .get(col.columnName)
                                                    ?.includes(option.lutValue) ||
                                                  false
                                                }
                                                className="pointer-events-none size-5 sm:size-5 lg:size-5 border-2 border-black bg-white shadow-sm  data-[state=checked]:border-black transition-all"
                                              />
                                              <Label
                                                htmlFor={option.lutValue}
                                                className="text-sm sm:text-base cursor-pointer flex select-none"
                                                style={{
                                                  color: filterAdvancedSelected
                                                    .get(col.columnName)
                                                    ?.includes(option.lutValue)
                                                    ? "#2563eb"
                                                    : "#222",
                                                  fontWeight:
                                                    filterAdvancedSelected
                                                      .get(col.columnName)
                                                      ?.includes(option.lutValue)
                                                      ? 700
                                                      : 500,
                                                  transition: "color 0.2s",
                                                }}
                                              >
                                                {option.lutValue}
                                              </Label>
                                            </div>
                                          )
                                        )}
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
                                    {(
                                      filterAdvancedSelected.get(
                                        col.columnName
                                      ) || []
                                    ).length === 0 ? (
                                      <div className="flex flex-row items-center justify-center w-full gap-2">
                                        <span className="text-gray-400 text-xs px-2 py-1">
                                          선택 사항 없음
                                        </span>
                                      </div>
                                    ) : (
                                      (
                                        filterAdvancedSelected.get(
                                          col.columnName
                                        ) || []
                                      ).map((value, index) => (
                                        <Badge
                                          key={`${col.columnName}-badge-${value}-${index}`}
                                          variant="secondary"
                                          className="text-xs px-2 py-1 bg-neutral-800 border-neutral-900 text-gray-100"
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
                                    setFilterAdvancedSelected(
                                      new Map(filterAdvancedSelected).set(
                                        col.columnName,
                                        []
                                      )
                                    );
                                  }}
                                >
                                  <div className="flex flex-row items-center justify-center w-full gap-2 pr-10">
                                    <RotateCcw className="h-4 w-4 text-gray-600" />
                                    <span className="text-gray-700">
                                      초기화
                                    </span>
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
            onClick={handleReset}
          >
            <RefreshCcw className="w-4 h-4 mr-1" />
            초기화
          </Button>
          <div className="flex gap-2 mt-4">
            <Button
              className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer"
              variant="default"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer"
              variant="default"
              onClick={handleAdvancedSearch}
            >
              필터 검색
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;
