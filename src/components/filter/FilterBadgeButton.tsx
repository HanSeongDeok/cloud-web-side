import { memo } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useFilterColumnHeaderSelectionStore, useFilterLutSelectionStore } from "@/stores/useSelectionStore";
import { useColumnsStore } from "@/stores/useColumnsStore";
import type { SearchInfoBody } from "@/stores/useTableDataStore";
import { useDataTableStore } from "@/stores/useTableDataStore";
import { convertSearchMode, createfiterInfo } from "@/handlers/events/filterSearch.service.handler";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";

const FilterLutBadge = memo(({allFilters, removeStep, tagId, columnHeaderId }: {
    columnHeaderId: string,
    tagId: string,
    allFilters: string[],
    removeStep: (columnHeaderId: string, stepId: string) => void
}) => {
    return (
        <>
            {allFilters.map((filter) => (
                <Badge
                    key={filter}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 flex items-center gap-1 bg-black border-neutral-900 text-white hover:bg-gray-800 transition-colors"
                >
                    <span className="text-gray-400 font-bold mr-1">{tagId}:</span>{filter}
                    <Button
                        onClick={() => removeStep(columnHeaderId, filter)}
                        className="ml-1 p-0 h-4 w-4 min-w-0 min-h-0 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                        variant="ghost"
                        size="sm"
                    >
                        <X className="w-3 h-3 text-rose-600 cursor-pointer" />
                    </Button>
                </Badge>
            ))}
        </>
    )
});

const AllFilterLutBadge = memo(({ stepClearAll, tagId }: {
    tagId: string,
    stepClearAll: () => void
}) => {
    return (
        <Badge
            variant="secondary"
            className="text-sm px-3 py-1.5 flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors"
        >
            <span className="text-purple-600 font-bold">{tagId}:</span> All
            <Button
                onClick={() => stepClearAll()}
                className="ml-1 p-0 h-4 w-4 min-w-0 min-h-0 hover:bg-purple-200 rounded-full transition-colors cursor-pointer"
                variant="ghost"
                size="sm"
            >
                <X className="w-3 h-3 text-purple-600 cursor-pointer" />
            </Button>
        </Badge>
    )
});

const FilterBadgeButton = memo(() => {
    const filterLutSelected = useFilterLutSelectionStore((state) => state.selected);
    // const filterLutClearAll = useFilterLutSelectionStore((state) => state.clearAll);
    const filterColumnHeaderClearAll = useFilterColumnHeaderSelectionStore((state) => state.clearAll);

    const mapColumns = useColumnsStore((state) => state.mapColumns);
    const paginationInfo = useDataTableStore((state) => state.pagination);
    const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);

    const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);
    const filterLutSetSelected = useFilterLutSelectionStore((state) => state.setSelected);

    const removeStep = async (columnHeaderId: string, stepId: string) => {
        const updatedStepSelected = new Map(filterLutSelected).set(columnHeaderId, filterLutSelected.get(columnHeaderId)?.filter((id: string) => id !== stepId) || []);
        filterLutSetSelected(updatedStepSelected);

        const mode = convertSearchMode(searchKeyword);
        const searchInfo = await createfiterInfo(updatedStepSelected, paginationInfo, searchKeyword, mode);
        fetchSearchData(searchInfo as SearchInfoBody)
    };

    // 전체 선택 해제 함수들
    const clearAll = () => {
        // filterLutClearAll();
        filterColumnHeaderClearAll();

        const updatedStepSelected = new Map<string, string[]>();  
        filterLutSetSelected(updatedStepSelected);

        const mode = convertSearchMode(searchKeyword);
        const searchInfo = createfiterInfo(updatedStepSelected, paginationInfo, searchKeyword, mode);
        fetchSearchData(searchInfo as SearchInfoBody); 
    };

    return (
        <div>
            {(filterLutSelected && Array.from(filterLutSelected.values()).some(arr => arr && arr.length > 0)) &&
                <div className="flex flex-wrap gap-2 mt-2 mb-2 overflow-y-auto max-h-40 scrollbar">
                    {/* stepSelected의 모든 key에 대해 StepBadge를 렌더링 */}
                    {Array.from(filterLutSelected.entries()).map(([key, steps]) => (
                        <FilterLutBadge
                            key={key}
                            allFilters={steps || []} // steps가 undefined일 경우 빈 배열로 처리
                            removeStep={removeStep}
                            columnHeaderId={key}
                            tagId={mapColumns.find(opt => opt.columnName === key)?.displayName || ""}
                        />
                    ))}

                    {/* 전체 해제 버튼 */}
                    <Badge
                        variant="destructive"
                        className="text-sm px-3 font-bold py-1.5 cursor-pointer bg-red-500 border-red-700 text-white hover:bg-red-700 hover:border-red-800 transition-colors"
                        onClick={clearAll}
                    >
                        모든 필터 해제
                    </Badge>
                </div>
            }
        </div>
    )
});

export default FilterBadgeButton;