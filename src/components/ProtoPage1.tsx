import { memo, useRef, useState } from "react";
import DataTable from "@/components/DataTable";
import DataInput from "./DataInput";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";
import { TableDropDownMenu } from "./DropDownMenu";
import { handleFileSelect } from "@/handlers/file.upload.handler";
import VehicleTypeMultiSelect from "./VehicleTypeMultiSelect";
import ECUTypeMultiSelect from "./ECUTypeMultiSelect";
import StepMultiSelect from "./StepMultiSelect";
import { Badge } from "./ui/badge";

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

const ProtoPage1 = memo(() => {
    const fileInput = useRef<HTMLInputElement>(null);

    // 각 MultiSelect의 선택 상태 관리
    const [vehicleSelected, setVehicleSelected] = useState<string[]>([]);
    const [ecuSelected, setEcuSelected] = useState<string[]>([]);
    const [stepSelected, setStepSelected] = useState<string[]>([]);

    const handleFileUpload = (fileInputRef: React.RefObject<HTMLInputElement>) => {
        fileInputRef.current?.click();
    };

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
        setVehicleSelected(prev => prev.filter(id => id !== vehicleId));
    };

    const removeECU = (ecuId: string) => {
        setEcuSelected(prev => prev.filter(id => id !== ecuId));
    };

    const removeStep = (stepId: string) => {
        setStepSelected(prev => prev.filter(id => id !== stepId));
    };

    // 전체 선택 해제 함수들
    const clearAll = () => {
        setVehicleSelected([]);
        setEcuSelected([]);
        setStepSelected([]);
    };

    const clearAllVehicles = () => {
        setVehicleSelected([]);
    };
    const clearAllECUs = () => {
        setEcuSelected([]);
    };
    const clearAllSteps = () => {
        setStepSelected([]);
    };

    // 모든 선택된 항목들
    const allSelectedVehicles = getSelectedVehicleLabels();
    const allSelectedECUs = getSelectedECULabels();
    const allSelectedSteps = getSelectedStepLabels();

    return (
        <div className="w-full px-6 py-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-6">중앙 집중형관리 시스템 저장소</h1>
                <p className="text-muted-foreground">
                    welcome to the CTM storage
                </p>
            </div>
            <div className="flex justify-center w-full mb-25">
                <div className="flex flex-col items-start w-[1000px]">

                    {/* 통합 배지 표시 영역 */}
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
                        </div>
                    }

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
                    )} */}
                    <DataInput />

                    {/* MultiSelect 컴포넌트들 */}
                    <div className="flex flex-row gap-x-4 mt-2">
                        <VehicleTypeMultiSelect
                            selected={vehicleSelected}
                            setSelected={setVehicleSelected}
                        />
                        <ECUTypeMultiSelect
                            selected={ecuSelected}
                            setSelected={setEcuSelected}
                        />
                        <StepMultiSelect
                            selected={stepSelected}
                            setSelected={setStepSelected}
                        />
                    </div>
                </div>
            </div>

            {/* 기존 테이블/업로드 영역 */}
            <div className="table-container">
                <div className="flex gap-2 ml-auto">
                    <input
                        ref={fileInput}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden-file-input"
                        accept="*/*"
                        aria-label="파일 선택"
                    />
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleFileUpload(fileInput)}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                    <TableDropDownMenu />
                </div>
            </div>

            <div className="space-y-8">
                <DataTable />
            </div>
        </div>
    )
});

export default ProtoPage1;