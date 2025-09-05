import { memo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEcuSelectionStore, useStepSelectionStore } from "@/stores/useSelectionStore";
import { useColumnsStore } from "@/stores/useColumnsStore";
import type { FilterSearchBody } from "@/stores/useTableDataStore";
import { useDataTableStore } from "@/stores/useTableDataStore";
import { createfiterInfo } from "@/handlers/events/filterSearch.service.handler";

const StepBadge = memo(({ allSelectedSteps, removeStep, tagId }: {
    columnHeaderId: string,
    tagId: string,
    allSelectedSteps: string[],
    removeStep: (columnHeaderId: string, stepId: string) => void
}) => {
    return (
        <>
            {allSelectedSteps.map((step) => (
                <Badge
                    key={step}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors"
                >
                    <span className="text-purple-600 font-bold">{tagId}:</span> {step}
                    <Button
                        onClick={() => removeStep(tagId.toLowerCase().replace(/\s+/g, ""), step)}
                        className="ml-1 p-0 h-4 w-4 min-w-0 min-h-0 hover:bg-purple-200 rounded-full transition-colors cursor-pointer"
                        variant="ghost"
                        size="sm"
                    >
                        <X className="w-3 h-3 text-purple-600 cursor-pointer" />
                    </Button>
                </Badge>
            ))}
        </>
    )
});

const AllStepBadge = memo(({ stepClearAll, tagId }: {
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

const BadgeButtons = memo(() => {
    const stepSelected = useStepSelectionStore((state) => state.selected);
    const stepClearAll = useStepSelectionStore((state) => state.clearAll);

    const ecuSelected = useEcuSelectionStore((state) => state.selected);
    const ecuClearAll = useEcuSelectionStore((state) => state.clearAll);

    const mapColumns = useColumnsStore((state) => state.mapColumns);
    const paginationInfo = useDataTableStore((state) => state.pagination);

    const fetchFilteredData = useDataTableStore((state) => state.fetchFilteredData);
    const fetchPageData = useDataTableStore((state) => state.fetchPageData);
    const stepSetSelected = useStepSelectionStore((state) => state.setSelected);

    const removeStep = async (columnHeaderId: string, stepId: string) => {
        const updatedStepSelected = new Map(stepSelected).set(columnHeaderId, stepSelected.get(columnHeaderId)?.filter((id: string) => id !== stepId) || []);
        stepSetSelected(updatedStepSelected);

        const filterInfo = await createfiterInfo(updatedStepSelected, paginationInfo);
        Array.from(updatedStepSelected.values()).some(arr => arr.length > 0) ?
            fetchFilteredData(filterInfo as FilterSearchBody) :
            fetchPageData(paginationInfo);
    };

    // 전체 선택 해제 함수들
    const clearAll = () => {
        stepClearAll();
        ecuClearAll();
        fetchPageData(paginationInfo);
    };

    return (
        <div>
            {(stepSelected && Array.from(stepSelected.values()).some(arr => arr.length > 0)) &&
                <div className="flex flex-wrap gap-2 mt-2 mb-2 overflow-y-auto max-h-38 scrollbar">
                    {/* stepSelected의 모든 key에 대해 StepBadge를 렌더링 */}
                    {Array.from(stepSelected.entries()).map(([key, steps]) => (
                        <StepBadge
                            key={key}
                            allSelectedSteps={steps}
                            removeStep={removeStep}
                            columnHeaderId={key}
                            tagId={mapColumns.find(opt => opt.originalName === key)?.displayName || ""}
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

export default BadgeButtons;