import { memo } from "react";
import { Button } from "./ui/button";
import { RefreshCcw, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog";
import { Separator } from "@components/ui/separator";
import { useFileToggleStore, useFileUploadStore } from "@/stores/useFileInputStore";
import FileUploadResizablePanel from "./FileUploadResizablePanel";
import { UploadBox } from "./UploadBox";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { useFileMultiSelectionStore, useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useState } from "react";
import Toggle from "./ui/toggle";
import { useDataTableStore } from "@/stores/useTableDataStore";

const UploadButton = memo(() => {
    // 업로드 다이얼로그 열기 닫기
    const [isOpen, setIsOpen] = useState(false);

    // 선택된 파일 상태
    const selectedFiles = useFileUploadStore((state) => state.selectedFiles);
    const clearFiles = useFileUploadStore((state) => state.clearFiles);

    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const setIsFolderMode = useFileToggleStore((state) => state.setIsFolderMode);

    // 파일 메타데이터 초기화
    const clearAllMetadata = useFileMetaDataStore((state) => state.clearAllMetadata);
    const clearSelectedFileIndex = useFileSelectionStore((state) => state.clearSelectedFileIndex);
    const clearSelectedFileIndices = useFileMultiSelectionStore((state) => state.clearSelectedFileIndices);

    /**
     * 
     */
    const fetchData = useDataTableStore((state) => state.fetchData);

    const handleReset = () => {
        clearFiles();
        clearAllMetadata();
        clearSelectedFileIndex();
        clearSelectedFileIndices();
    }
    // TODO 업로드 로직 추가
    const handleUpload = () => {
        // setIsOpen(false);
        if (isFolderMode) {
            console.log("folder mode");
            
        } else {
            console.log("file mode");
        }
    }

    const handleCancel = () => {
        handleReset();
        setIsOpen(false);
    }

    return (<>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="default"
                    className="flex self-start w-35 sm:w-35 lg:w-35 h-12 sm:h-12 lg:h-12 justify-center text-sm sm:text-base 
                        cursor-pointer bg-white rounded-md hover:bg-gray-100/50 transition-colors border border-gray-300
                        hover:border-gray-400 focus-visible:ring-0"
                >
                    <Upload className="w-4 h-4 mr-3" />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col resize overflow-hidden border-2 border-blue-200 rounded-lg shadow-lg bg-white"
                style={{
                    width: 'clamp(320px, 95vw, 2200px)',
                    height: 'clamp(400px, 95vh, 2000px)',
                    minWidth: 600,
                    minHeight: 800,
                    maxWidth: '95vw',
                    maxHeight: '95vh',
                }}>
                <DialogHeader>
                    <DialogTitle>파일 업로드</DialogTitle>
                    <DialogDescription>
                        파일 및 폴더를 업로드하세요.
                    </DialogDescription>
                </DialogHeader>
                {/* 파일 및 폴더 선택 토글 */}
                <div className="flex items-center space-x-2 mt-1 ml-2">
                    <Toggle
                        checked={isFolderMode}
                        onChange={setIsFolderMode}
                    />
                    <span className="text-xl ml-5 font-bold text-sky-600">
                        {isFolderMode ? '폴더' : '파일'}
                    </span>
                </div>
                <Separator className="h-0.5 bg-gray-300/50 opacity-100" />
                    {selectedFiles.length > 0 ?
                        <FileUploadResizablePanel /> :
                        <UploadBox className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative" />
                    }
                <div className="h-20 bg-white px-6 flex items-center justify-between border-t border-gray-300">
                    <Button 
                        className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 mt-4 cursor-pointer" 
                        variant="default" 
                        onClick={handleReset}>
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        초기화
                    </Button>
                    <div className="flex gap-2 mt-4">
                        <Button className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer" variant="default" onClick={handleCancel}>취소</Button>
                        <Button className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer" variant="default" onClick={handleUpload}>업로드</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>)
});

export default UploadButton;