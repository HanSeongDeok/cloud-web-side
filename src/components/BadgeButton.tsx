import { memo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEcuSelectionStore, useStepSelectionStore, useTypeSelectionStore } from "@/stores/useSelectionStore";
import { lutOptions, typeOptions } from "@/models/multiSelectModel";
import { useColumnsStore } from "@/stores/useColumnsStore";
import { useDataTableStore } from "@/stores/useTableDataStore";


const TypeBadge = memo(({ allSelectedTypes, removeType }: {
    allSelectedTypes: string[],
    removeType: (typeId: string) => void
}) => {
    return (
        <>
            {allSelectedTypes.map((type) => (
                <Badge
                    key={type}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 flex items-center gap-1 bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 transition-colors"
                >
                    <span className="text-yellow-600 font-bold">타입:</span> {type}
                    <Button
                        onClick={() => removeType(typeOptions.find(opt => opt.label === type)?.id || "")}
                        className="ml-1 p-0 h-5 w-5 min-w-0 min-h-0 hover:bg-yellow-200 rounded-full transition-colors"
                        variant="ghost"
                        size="sm"
                    >
                        <X className="w-4 h-4 text-yellow-600 cursor-pointer" />
                    </Button>
                </Badge>
            ))}
        </>
    )
});


const StepBadge = memo(({ allSelectedSteps, removeStep, tagId }: {
    columnHeaderId: string,
    tagId: string,
    allSelectedSteps: string[],
    removeStep: (columnHeaderId: string, stepId: string) => void
}) => {
    const ecuSelected = useEcuSelectionStore((state) => state.selected)
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
                        onClick={() => removeStep(ecuSelected, lutOptions[ecuSelected].find(opt => opt.label === step)?.label || "")}
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

const AllTypeBadge = memo(({ typeClearAll }: {
    typeClearAll: () => void
}) => {
    return (
        <Badge
            variant="secondary"
            className="text-sm px-3 py-1.5 flex items-center gap-1 bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 transition-colors"
        >
            <span className="text-yellow-600 font-bold">타입:</span> All
            <Button
                onClick={() => typeClearAll()}
                className="ml-1 p-0 h-4 w-4 min-w-0 min-h-0 hover:bg-yellow-200 rounded-full transition-colors cursor-pointer"
                variant="ghost"
                size="sm"
            >
                <X className="w-3 h-3 text-yellow-600 cursor-pointer" />
            </Button>
        </Badge>
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
    const stepSetSelected = useStepSelectionStore((state) => state.setSelected);
    const stepClearAll = useStepSelectionStore((state) => state.clearAll);
    const ecuClearAll = useEcuSelectionStore((state) => state.clearAll);
    
    const mapColumns = useColumnsStore((state) => state.mapColumns);
    const typeSelected = useTypeSelectionStore((state) => state.selected);
    const typeSetSelected = useTypeSelectionStore((state) => state.setSelected);
    const typeClearAll = useTypeSelectionStore((state) => state.clearAll);

    const clearFiltered = useDataTableStore((state) => state.clearFiltered);
    const setFiltered = useDataTableStore((state) => state.setFiltered);

    const getSelectedTypeLabels = () => {
        return typeOptions.filter(opt => typeSelected.includes(opt.id)).map(opt => opt.label);
    };

    const removeStep = (columnHeaderId: string, stepId: string) => {
        const updatedStepSelected = new Map(stepSelected).set(columnHeaderId, stepSelected.get(columnHeaderId)?.filter((id: string) => id !== stepId) || []);
        if (Array.from(updatedStepSelected.values()).some(arr => arr.length > 0)) {
            setFiltered(true);
        } else {
            setFiltered(false);
        }
        stepSetSelected(updatedStepSelected);
    };

    const removeType = (typeId: string) => {
        typeSetSelected(typeSelected.filter((id: string) => id !== typeId));
    };

    // 모든 선택된 항목들
    const allSelectedTypes = getSelectedTypeLabels();

    // 전체 선택 해제 함수들
    const clearAll = () => {
        typeClearAll();
        stepClearAll(); 
        ecuClearAll();
        clearFiltered();
    };

    return (
        <div>
            {(allSelectedTypes.length > 0 || (stepSelected && Array.from(stepSelected.values()).some(arr => arr.length > 0))) &&
                <div className="flex flex-wrap gap-2 mt-2 mb-2 overflow-y-auto max-h-38 scrollbar">
                    {/* 차량 선택 배지들 */}
                    <TypeBadge allSelectedTypes={allSelectedTypes} removeType={removeType} />

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