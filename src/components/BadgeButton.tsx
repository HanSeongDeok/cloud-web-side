import { memo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEcuSelectionStore, useStepSelectionStore, useTypeSelectionStore } from "@/stores/useSelectionStore";
import { stepOptions, typeOptions } from "@/models/multiSelectModel";
import { useColumnsStore } from "@/stores/useColumnsStore";


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

const ECUBadge = memo(({ allSelectedECUs, removeECU }: {
    allSelectedECUs: string[],
    removeECU: (ecuId: string) => void
}) => {
    const mapColumns = useColumnsStore((state) => state.mapColumns);
    return (
        <>
            {allSelectedECUs.map((ecu) => (
                <Badge
                    key={ecu}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 flex items-center gap-1 bg-green-50 border-green-200 text-green-800 hover:bg-green-100 transition-colors"
                >
                    <span className="text-green-600 font-bold">컬럼 이름:</span> {ecu}
                    <Button
                        onClick={() => removeECU(mapColumns.find(opt => opt.displayName === ecu)?.id || "")}
                        className="ml-1 p-0 h-5 w-5 min-w-0 min-h-0 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
                        variant="ghost"
                        size="sm"
                    >
                        <X className="w-10 h-10 text-red-500 cursor-pointer" />
                    </Button>
                </Badge>
            ))}
        </>
    )
});

const StepBadge = memo(({ allSelectedSteps, removeStep }: {
    allSelectedSteps: string[],
    removeStep: (stepId: string) => void
}) => {
    return (
        <>
            {allSelectedSteps.map((step) => (
                <Badge
                    key={step}
                    variant="secondary"
                    className="text-sm px-3 py-1.5 flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors"
                >
                    <span className="text-purple-600 font-bold">단계:</span> {step}
                    <Button
                        onClick={() => removeStep(stepOptions.find(opt => opt.label === step)?.id || "")}
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

const AllECUBadge = memo(({ ecuClearAll }: {
    ecuClearAll: () => void
}) => {
    return (
        <Badge
            variant="secondary"
            className="text-sm px-3 py-1.5 flex items-center gap-1 bg-green-50 border-green-200 text-green-800 hover:bg-green-100 transition-colors"
        >
            <span className="text-green-600 font-bold">ECU:</span> All
            <Button
                onClick={() => ecuClearAll()}
                className="ml-1 p-0 h-4 w-4 min-w-0 min-h-0 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
                variant="ghost"
                size="sm"
            >
                <X className="w-3 h-3 text-green-600 cursor-pointer" />
            </Button>
        </Badge>
    )
});

const AllStepBadge = memo(({ stepClearAll }: {
    stepClearAll: () => void
}) => {
    return (
        <Badge
            variant="secondary"
            className="text-sm px-3 py-1.5 flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors"
        >
            <span className="text-purple-600 font-bold">단계:</span> All
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
    // TODO 나중에 Handler로 추출

    const ecuSelected = useEcuSelectionStore((state) => state.selected);
    const ecuSetSelected = useEcuSelectionStore((state) => state.setSelected);
    const ecuClearAll = useEcuSelectionStore((state) => state.clearAll);
    const ecuIsAllSelected = useEcuSelectionStore((state) => state.isAllSelected);

    const stepSelected = useStepSelectionStore((state) => state.selected);
    const stepSetSelected = useStepSelectionStore((state) => state.setSelected);
    const stepClearAll = useStepSelectionStore((state) => state.clearAll);
    const stepIsAllSelected = useStepSelectionStore((state) => state.isAllSelected);

    const typeSelected = useTypeSelectionStore((state) => state.selected);
    const typeSetSelected = useTypeSelectionStore((state) => state.setSelected);
    const typeClearAll = useTypeSelectionStore((state) => state.clearAll);
    const typeIsAllSelected = useTypeSelectionStore((state) => state.isAllSelected);

    
    const mapColumns = useColumnsStore((state) => state.mapColumns);

    // 선택된 항목들을 배지로 표시하기 위한 함수들
    const getSelectedECULabels = () => {
        return mapColumns.filter(opt => ecuSelected.includes(opt.id)).map(opt => opt.displayName);
    };
    const getSelectedStepLabels = () => {
        return stepOptions.filter(opt => stepSelected.includes(opt.id)).map(opt => opt.label);
    };
    const getSelectedTypeLabels = () => {
        return typeOptions.filter(opt => typeSelected.includes(opt.id)).map(opt => opt.label);
    };

    // 개별 항목 제거 함수들
    const removeECU = (ecuId: string) => {
        ecuSetSelected(ecuSelected.filter((id: string) => id !== ecuId));
    };
    const removeStep = (stepId: string) => {
        stepSetSelected(stepSelected.filter((id: string) => id !== stepId));
    };
    const removeType = (typeId: string) => {
        typeSetSelected(typeSelected.filter((id: string) => id !== typeId));
    };

    // 모든 선택된 항목들
    const allSelectedECUs = getSelectedECULabels();
    const allSelectedSteps = getSelectedStepLabels();
    const allSelectedTypes = getSelectedTypeLabels();

    // 전체 선택 해제 함수들
    const clearAll = () => {
        typeClearAll();
        ecuClearAll();
        stepClearAll();
    };

    return (
        <div>
            {(allSelectedTypes.length > 0 || allSelectedECUs.length > 0 || allSelectedSteps.length > 0) &&
                <div className="flex flex-wrap gap-2 mt-2 mb-2 overflow-y-auto max-h-38 scrollbar">
                    {/* 차량 선택 배지들 */}
                    {typeIsAllSelected() ?
                        <AllTypeBadge typeClearAll={typeClearAll} /> :
                        <TypeBadge allSelectedTypes={allSelectedTypes} removeType={removeType} />}
                    {ecuIsAllSelected() ?
                        <AllECUBadge ecuClearAll={ecuClearAll} /> :
                        <ECUBadge allSelectedECUs={allSelectedECUs} removeECU={removeECU} />}
                    {stepIsAllSelected() ?
                        <AllStepBadge stepClearAll={stepClearAll} /> :
                        <StepBadge allSelectedSteps={allSelectedSteps} removeStep={removeStep} />}

                    {/* 전체 해제 버튼 */}
                    <Badge
                        variant="destructive"
                        className="text-sm px-3 font-bold py-1.5 cursor-pointer bg-red-500 border-red-700 text-white hover:bg-red-700 hover:border-red-800 transition-colors"
                        onClick={clearAll}
                    >
                        모든 필터 해제
                    </Badge>

                    {/* 섹션 별 전체 해제 버튼 */}
                    {/* {(allSelectedVehicles.length > 0 || allSelectedECUs.length > 0 || allSelectedSteps.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                {allSelectedVehicles.length > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="text-sm px-2 py-1 cursor-pointer"
                                        onClick={clearAllVehicles}
                                    >
                                        차량 전체 해제
                                    </Badge>
                                )}
                                {allSelectedECUs.length > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="text-sm px-2 py-1 cursor-pointer"
                                        onClick={clearAllECUs}
                                    >
                                        ECU 전체 해제
                                    </Badge>
                                )}
                                {allSelectedSteps.length > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="text-sm px-2 py-1 cursor-pointer"
                                        onClick={clearAllSteps}
                                    >
                                        단계 전체 해제
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                )} */}
                </div>
            }
        </div>
    )
});

export default BadgeButtons;