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
import { useUploadIsOpenStore } from "@/stores/useIsDialogOpenStore";
import { useFileToggleStore, useFileUploadStore } from "@/stores/useFileInputStore";
import { Switch } from "@components/ui/switch";
import FileUploadResizablePanel from "./FileUploadResizablePanel";
import { UploadBox } from "./UploadBox";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { useFileMultiSelectionStore, useFileSelectionStore } from "@/stores/useFileSelectionStore";

const UploadButton = memo(() => {
    // 업로드 다이얼로그 열기 닫기
    const isOpen = useUploadIsOpenStore((state) => state.isOpen);
    const setIsOpen = useUploadIsOpenStore((state) => state.setIsOpen);

    // 선택된 파일 상태
    const selectedFiles = useFileUploadStore((state) => state.selectedFiles);
    const clearFiles = useFileUploadStore((state) => state.clearFiles);

    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const setIsFolderMode = useFileToggleStore((state) => state.setIsFolderMode);

    // 파일 메타데이터 초기화
    const clearAllMetadata = useFileMetaDataStore((state) => state.clearAllMetadata);
    const clearSelectedFileIndex = useFileSelectionStore((state) => state.clearSelectedFileIndex);
    const clearSelectedFileIndices = useFileMultiSelectionStore((state) => state.clearSelectedFileIndices);

    const handleReset = () => {
        clearFiles();
        clearAllMetadata();
        clearSelectedFileIndex();
        clearSelectedFileIndices();
    }
    // TODO 업로드 로직 추가
    const handleUpload = () => {

    }

    const handleCancel = () => {
        handleReset();
        setIsOpen(false);
    }

    return (<>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>파일 업로드</DialogTitle>
                    <DialogDescription>
                        파일 및 폴더를 업로드하세요.
                    </DialogDescription>
                </DialogHeader>
                {/* 파일 및 폴더 선택 토글 */}
                <div className="flex items-center space-x-2 mt-1 ml-2">
                    <Switch
                        id="folder-mode"
                        checked={isFolderMode}
                        onCheckedChange={setIsFolderMode}
                        className="scale-170"
                    />
                    <span className="text-lg ml-5 font-bold text-sky-600">
                        {isFolderMode ? '폴더' : '파일'}
                    </span>
                </div>
                <Separator />

                {selectedFiles.length > 0 ?
                    <FileUploadResizablePanel /> :
                    <UploadBox className="mt-2 w-full h-120 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative" />}

                <div className="flex justify-between items-center gap-2 mt-4">
                    <Button variant="outline" onClick={handleReset}>
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        초기화
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel}>취소</Button>
                        <Button variant="outline" onClick={handleUpload}>업로드</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>)
});

export default UploadButton;