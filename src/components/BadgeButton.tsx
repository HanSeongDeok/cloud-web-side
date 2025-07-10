import { memo, useRef } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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

interface BadgeButtonsProps {
    selected: string[];
    setSelected: (selected: string[]) => void;
}

interface BadgeButtonsPropsArr {
    /**
     * 1: vehicle
     * 2: ecu
     * 3: step
     */
    props: BadgeButtonsProps[];
}

const BadgeButtons = memo(({props}: BadgeButtonsPropsArr) => {
    // useRef를 사용해서 상태 참조

    // 선택된 항목들을 배지로 표시하기 위한 함수들
    const getSelectedVehicleLabels = () => {
        return vehicleOptions.filter(opt => props[0].selected.includes(opt.id)).map(opt => opt.label);
    };

    const getSelectedECULabels = () => {
        return ecuOptions.filter(opt => props[1].selected.includes(opt.id)).map(opt => opt.label);
    };

    const getSelectedStepLabels = () => {
        return stepOptions.filter(opt => props[2].selected.includes(opt.id)).map(opt => opt.label);
    };

    // 개별 항목 제거 함수들
    const removeVehicle = (vehicleId: string) => {
        const newSelected = props[0].selected.filter((id: string) => id !== vehicleId);
        props[0].setSelected(newSelected);
    };

    const removeECU = (ecuId: string) => {
        const newSelected = props[1].selected.filter((id: string) => id !== ecuId);
        props[1].setSelected(newSelected);
    };

    const removeStep = (stepId: string) => {
        const newSelected = props[2].selected.filter((id: string) => id !== stepId);
        props[2].setSelected(newSelected);
    };

    // 전체 선택 해제 함수들
    const clearAll = () => {
        props[0].setSelected([]);
        props[1].setSelected([]);
        props[2].setSelected([]);
    };

    const clearAllVehicles = () => {
        props[0].setSelected([]);
    };
    
    const clearAllECUs = () => {
        props[1].setSelected([]);
    };
    
    const clearAllSteps = () => {
        props[2].setSelected([]);
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

                {/* 해제 라벨과 버튼들 */}
                {(allSelectedVehicles.length > 0 || allSelectedECUs.length > 0 || allSelectedSteps.length > 0) && (
                    <div> 
                        {/* 해제 버튼들 */}
                        <div className="flex gap-2 mt-1">
                            {allSelectedVehicles.length > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="text-sm px-2 py-1 cursor-pointer"
                                    onClick={clearAllVehicles}
                                >
                                    차량 해제
                                </Badge>
                            )}
                            {allSelectedECUs.length > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="text-sm px-2 py-1 cursor-pointer"
                                    onClick={clearAllECUs}
                                >
                                    ECU 해제
                                </Badge>
                            )}
                            {allSelectedSteps.length > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="text-sm px-2 py-1 cursor-pointer"
                                    onClick={clearAllSteps}
                                >
                                    단계 해제
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>
        }
        </div>
    )
});

export default BadgeButtons;