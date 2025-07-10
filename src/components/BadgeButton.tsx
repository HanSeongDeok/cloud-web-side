import { memo, useRef } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEcuSelectionStore, useStepSelectionStore, useVehicleSelectionStore } from "@/stores/useSelectionStore";

// 각 MultiSelect의 옵션 정의
const vehicleOptions = [
    { id: "kona", label: "KONA" },
    { id: "avante", label: "AVANTE" },
    { id: "ioniq", label: "IONIQ" },
    { id: "sonata", label: "SONATA" },
    { id: "grandeur", label: "GRANDEUR" },
    { id: "porter", label: "PORTER" },
    { id: "staria", label: "STARIA" },
    { id: "casper", label: "CASPER" },
];

const ecuOptions = [
    { id: "ems", label: "EMS" },
    { id: "tcu", label: "TCU" },
    { id: "hvac", label: "HVAC" },
    { id: "bcm", label: "BCM" },
    { id: "mcu", label: "MCU" },
    { id: "eps", label: "EPS" },
    { id: "srs", label: "SRS" },
    { id: "abs", label: "ABS" },
];

const stepOptions = [
    { id: "step1", label: "Step 1" },
    { id: "step2", label: "Step 2" },
    { id: "step3", label: "Step 3" },
    { id: "step4", label: "Step 4" },
    { id: "step5", label: "Step 5" },
    { id: "step6", label: "Step 6" },
    { id: "step7", label: "Step 7" },
    { id: "step8", label: "Step 8" },
];

const BadgeButtons = memo(() => {
    const vehicleSelected = useVehicleSelectionStore((state) => state.selected);
    const vehicleSetSelected = useVehicleSelectionStore((state) => state.setSelected);
    const vehicleClearAll = useVehicleSelectionStore((state) => state.clearAll);

    const ecuSelected = useEcuSelectionStore((state) => state.selected);
    const ecuSetSelected = useEcuSelectionStore((state) => state.setSelected);
    const ecuClearAll = useEcuSelectionStore((state) => state.clearAll);

    const stepSelected = useStepSelectionStore((state) => state.selected);
    const stepSetSelected = useStepSelectionStore((state) => state.setSelected);
    const stepClearAll = useStepSelectionStore((state) => state.clearAll);

    // 선택된 항목들을 배지로 표시하기 위한 함수들
    const getSelectedVehicleLabels = () => {
        return vehicleOptions.filter(opt => vehicleSelected.includes(opt.id)).map(opt => opt.label);
    };

    const getSelectedECULabels = () => {
        return ecuOptions.filter(opt => ecuSelected.includes(opt.id)).map(opt => opt.label);
    };

    const getSelectedStepLabels = () => {
        return stepOptions.filter(opt => stepSelected.includes(opt.id)).map(opt => opt.label);
    };

    // 개별 항목 제거 함수들
    const removeVehicle = (vehicleId: string) => {
        const newSelected = vehicleSelected.filter((id: string) => id !== vehicleId);
        vehicleSetSelected(newSelected);
    };

    const removeECU = (ecuId: string) => {
        const newSelected = ecuSelected.filter((id: string) => id !== ecuId);
        ecuSetSelected(newSelected);
    };

    const removeStep = (stepId: string) => {
        const newSelected = stepSelected.filter((id: string) => id !== stepId);
        stepSetSelected(newSelected);
    };

    // 전체 선택 해제 함수들
    const clearAll = () => {
        vehicleClearAll();
        ecuClearAll();
        stepClearAll();
    };

    // 모든 선택된 항목들
    const allSelectedVehicles = getSelectedVehicleLabels();
    const allSelectedECUs = getSelectedECULabels();
    const allSelectedSteps = getSelectedStepLabels();

    return (
        <div>
            {(allSelectedVehicles.length > 0 || allSelectedECUs.length > 0 || allSelectedSteps.length > 0) &&
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {/* 차량 선택 배지들 */}
                    {allSelectedVehicles.map((vehicle) => (
                        <Badge
                            key={vehicle}
                            variant="secondary"
                            className="text-sm px-2 py-1 flex items-center gap-1"
                        >
                            <span className="text-blue-400 font-bold">차량:</span> {vehicle}
                            <Button
                                onClick={() => removeVehicle(vehicleOptions.find(opt => opt.label === vehicle)?.id || "")}
                                className="ml-1 p-0 h-3 w-3 min-w-0 min-h-0 hover:bg-transparent"
                                variant="ghost"
                                size="sm"
                            >
                                <X className="w-2 h-2" />
                            </Button>
                        </Badge>
                    ))}

                    {/* ECU 선택 배지들 */}
                    {allSelectedECUs.map((ecu) => (
                        <Badge
                            key={ecu}
                            variant="secondary"
                            className="text-sm px-2 py-1 flex items-center gap-1"
                        >
                            <span className="text-green-400 font-bold">ECU:</span> {ecu}
                            <Button
                                onClick={() => removeECU(ecuOptions.find(opt => opt.label === ecu)?.id || "")}
                                className="ml-1 p-0 h-3 w-3 min-w-0 min-h-0 hover:bg-transparent"
                                variant="ghost"
                                size="sm"
                            >
                                <X className="w-2 h-2" />
                            </Button>
                        </Badge>
                    ))}

                    {/* 단계 선택 배지들 */}
                    {allSelectedSteps.map((step) => (
                        <Badge
                            key={step}
                            variant="secondary"
                            className="text-sm px-2 py-1 flex items-center gap-1"
                        >
                            <span className="text-purple-400 font-bold">단계:</span> {step}
                            <Button
                                onClick={() => removeStep(stepOptions.find(opt => opt.label === step)?.id || "")}
                                className="ml-1 p-0 h-3 w-3 min-w-0 min-h-0 hover:bg-transparent"
                                variant="ghost"
                                size="sm"
                            >
                                <X className="w-2 h-2" />
                            </Button>
                        </Badge>
                    ))}

                    {/* 전체 해제 버튼 */}
                    <Badge
                        variant="destructive"
                        className="text-sm px-2 py-1 cursor-pointer"
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