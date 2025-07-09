import { memo, useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { useIsOpenStore } from "@/stores/useIsOpenStore";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import { useFilterUploaderStore } from "@/stores/useUploaderStore";
import { useFileTypeStore } from "@/stores/useFileTypeStore";
import { useFileNameStore } from "@/stores/useFileNameStore";
import { Separator } from "@components/ui/separator";
import { useVehicleStore } from "@/stores/useVehicleStore";
import { useStepStore } from "@/stores/useStepStore";
import { ScrollArea } from "@components/ui/scroll-area";
import useResultStore from "@/stores/useResultStore";
import { useDateStore } from "@/stores/useDateStore";

/**
 * 데이터 입력 컴포넌트 - ag-grid용
 * @returns 데이터 입력 컴포넌트
 */
const DataInput = memo(() => {
    // 다이얼로그 열기 닫기
    const isOpen = useIsOpenStore((state) => state.isOpen);
    const setIsOpen = useIsOpenStore((state) => state.setIsOpen);

    // 검색 키워드
    const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
    const setSearchKeyword = useSearchKeywordStore((state) => state.setSearchKeyword);

    // 필터 검색의 업로더 이름
    const uploader = useFilterUploaderStore((state) => state.uploader);
    const setUploader = useFilterUploaderStore((state) => state.setUploader);

    // 필터 검색의 파일 타입
    const fileType = useFileTypeStore((state) => state.filetype);
    const setFileType = useFileTypeStore((state) => state.setFileType);

    // 필터 검색의 파일 이름
    const fileName = useFileNameStore((state) => state.fileName);
    const setFileName = useFileNameStore((state) => state.setFileName);

    // 필터 검색의 차량
    const vehicle = useVehicleStore((state) => state.vehicle);
    const setVehicle = useVehicleStore((state) => state.setVehicle);

    // 필터 검색의 단계
    const step = useStepStore((state) => state.step);
    const setStep = useStepStore((state) => state.setStep);

    // 필터 검색의 테스트 결과
    const result = useResultStore((state) => state.result);
    const setResult = useResultStore((state) => state.setResult);

    const startDate = useDateStore((state) => state.startDate);
    const endDate = useDateStore((state) => state.endDate);

    const setStartDate = useDateStore((state) => state.setStartDate);
    const setEndDate = useDateStore((state) => state.setEndDate);

    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");

    const handleReset = () => {
        setFileType("");
        setUploader("");
        setFileName("");
        setVehicle("");
        setStep("");
        setResult("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="flex justify-center w-full mb-6">
            <div className="relative w-[1000px]">
                <Input
                    placeholder="Filter data..."
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                    className="w-full h-14 text-lg px-6 pr-12"
                />
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100"
                        >
                            <Filter className="h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <div className="max-h-165 overflow-y-auto scrollbar px-2 pb-2">
                            <DialogHeader>
                                <DialogTitle>고급 검색 기능</DialogTitle>
                                <DialogDescription>
                                    데이터를 필터링하기 위한 조건을 설정하세요.
                                </DialogDescription>
                                <Label className="text-sky-700 font-bold text-lg"> 파일 필터 </Label>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <div className="col-span-4">
                                        <Label htmlFor="fileType" className="mb-2 block text-left ml-1 text-base">타입</Label>
                                        <Select value={fileType} onValueChange={setFileType}>
                                            <SelectTrigger id="fileType" className="w-full border rounded-md p-2">
                                                <SelectValue placeholder="파일 타입 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="folder" className="font-medium ">폴더</SelectItem>
                                                <SelectItem value="file" className="font-medium ">파일</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-2 mt-1">
                                    <Label className="col-span-4  text-left ml-1 text-base">업로더</Label>
                                    <div className="col-span-4">
                                        <Input
                                            type="text"
                                            value={uploader}
                                            onChange={(e) => setUploader(e.target.value)}
                                            placeholder="업로더 이름 입력"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-2 mt-1">
                                    <Label className="col-span-4 mb-1 text-left ml-1 text-base">파일 이름</Label>
                                    <div className="col-span-4">
                                        <Input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            placeholder="파일 이름 입력"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label className="col-span-4 mb-1 text-left ml-1 text-base">날짜 범위</Label>
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="date"
                                                className="p-2 border rounded-md flex-1"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                placeholder="yyyy-mm-dd"
                                                title="시작일"
                                            />
                                            <span> ~ </span>
                                            <input
                                                type="date"
                                                className="p-2 border rounded-md flex-1"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                placeholder="yyyy-mm-dd"
                                                title="종료일"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <div className="col-span-4">
                                        <Label htmlFor="vehicleType" className="mb-2 block text-left ml-1 text-base">차량</Label>
                                        <Select value={vehicle} onValueChange={setVehicle}>
                                            <SelectTrigger id="vehicleType" className="w-full border rounded-md p-2">
                                                <SelectValue placeholder="차량 타입 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className="max-h-34 overflow-y-auto scrollbar">
                                                    <ScrollArea className="max-h-36">
                                                        <SelectItem value="KONA" className="font-medium ">KONA</SelectItem>
                                                        <SelectItem value="AVANTE" className="font-medium ">AVANTE</SelectItem>
                                                        <SelectItem value="IONIQ" className="font-medium ">IONIQ</SelectItem>
                                                    </ScrollArea>
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <div className="col-span-4">
                                        <Label htmlFor="stepType" className="mb-2 block text-left ml-1 text-base">단계</Label>
                                        <Select value={step} onValueChange={setStep}>
                                            <SelectTrigger id="stepType" className="w-full border rounded-md p-2">
                                                <SelectValue placeholder="단계 타입 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className="max-h-34 overflow-y-auto scrollbar">
                                                    <SelectItem value="Step_1" className="font-medium ">Step_1</SelectItem>
                                                    <SelectItem value="Step_2" className="font-medium ">Step_2</SelectItem>
                                                    <SelectItem value="Step_3" className="font-medium ">Step_3</SelectItem>
                                                    <SelectItem value="Step_4" className="font-medium ">Step_4</SelectItem>
                                                    <SelectItem value="Step_5" className="font-medium ">Step_5</SelectItem>
                                                    <SelectItem value="Step_6" className="font-medium ">Step_6</SelectItem>
                                                    <SelectItem value="Step_7" className="font-medium ">Step_7</SelectItem>
                                                    <SelectItem value="Step_8" className="font-medium ">Step_8</SelectItem>
                                                    <SelectItem value="Step_9" className="font-medium ">Step_9</SelectItem>
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <div className="col-span-4">
                                        <Label htmlFor="resultType" className="mb-2 block text-left ml-1 text-base">테스트 결과</Label>
                                        <Select value={result} onValueChange={setResult}>
                                            <SelectTrigger id="resultType" className="w-full border rounded-md p-2">
                                                <SelectValue placeholder="테스트 결과 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className="max-h-34 overflow-y-auto scrollbar">
                                                    <SelectItem value="pass" className="font-medium ">PASS</SelectItem>
                                                    <SelectItem value="fail" className="font-medium ">FAIL</SelectItem>
                                                    <SelectItem value="ok" className="font-medium ">OK</SelectItem>
                                                    <SelectItem value="ng" className="font-medium ">NG</SelectItem>
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2 mt-4">
                            <Button variant="outline" onClick={handleReset}>
                                <RefreshCcw className="w-4 h-4 mr-1" />
                                초기화
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>필터 검색</Button>
                            </div>
                        </div>

                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
});

export default DataInput;   