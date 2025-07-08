import { memo, useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";
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

/**
 * 데이터 입력 컴포넌트 - ag-grid용
 * @returns 데이터 입력 컴포넌트
 */
const DataInput = memo(() => {
    const isOpen = useIsOpenStore((state) => state.isOpen);
    const setIsOpen = useIsOpenStore((state) => state.setIsOpen);
    const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
    const setSearchKeyword = useSearchKeywordStore((state) => state.setSearchKeyword);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [fileType, setFileType] = useState("");
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
                        <DialogHeader>
                            <DialogTitle>고급 검색 기능</DialogTitle>
                            <DialogDescription>
                                데이터를 필터링하기 위한 조건을 설정하세요.
                            </DialogDescription>
                            <Label className="text-sky-700 font-bold text-lg"> 파일 필터 </Label>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="col-span-4">
                                    <Label htmlFor="fileType" className="mb-4 block text-left">타입</Label>
                                    <Select value={fileType} onValueChange={setFileType}>
                                        <SelectTrigger id="fileType" className="w-full border rounded-md p-2">
                                            <SelectValue placeholder="파일 타입 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="folder" className="font-medium text-gray-700 hover:bg-sky-100">폴더</SelectItem>
                                            <SelectItem value="file" className="font-medium text-gray-700 hover:bg-sky-100">파일</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="col-span-4 mb-1 text-left">Data Range</Label>
                                <div className="col-span-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            className="p-2 border rounded-md flex-1"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            placeholder="시작일"
                                            title="시작일"
                                        />
                                        <span className="text-gray-500">~</span>
                                        <input
                                            type="date"
                                            className="p-2 border rounded-md flex-1"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            placeholder="종료일"
                                            title="종료일"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                취소
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}>
                                필터 검색
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
});

export default DataInput; 