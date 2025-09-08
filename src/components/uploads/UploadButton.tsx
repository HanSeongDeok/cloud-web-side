import { memo } from "react";
import { Button } from "../ui/button";
import { RefreshCcw, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Separator } from "@components/ui/separator";
import { useFileToggleStore, useFileUploadStore } from "@/stores/useFileInputStore";
import FileUploadResizablePanel from "./FileUploadResizablePanel";
import { UploadBox } from "./UploadBox";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { useFileMultiSelectionStore, useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useState } from "react";
import Toggle from "../ui/toggle";
import { fetchInitUpload, fetchUpload, fetchUploadComplete } from "@/handlers/services/upLoad.service.handler";
import { validateFileMetadata } from "@/handlers/events/upload.validation.handler";

export interface UploadData {
    sessionId: string;
    id: number;
    presignedUrl: string;
    file: File;
    type: string;
}

// 멀티파트 파트 정보 타입
interface MultipartPartInfo {
    partNumber: number;
    etag: string;
}

export interface UploadFileData {
    id: number;
    type: string;
    etag?: string; // 단일 업로드 시
    multipartParts?: MultipartPartInfo[]; // 멀티파트 업로드 시
    status: string;
    errorMessage?: string;
}

export interface UploadCompleteData {
    sessionId: string;
    files: UploadFileData[];
}

export interface FileInfo {
    name: string;
    fileSize: number;
    fileExtension: string;
    file: File;
    mimeType: string;
    [key: string]: any;
  }

const UploadButton = memo(() => {
    // 업로드 다이얼로그 열기 닫기
    const [isOpen, setIsOpen] = useState(false);
    
    // 알람 다이얼로그 상태
    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        type: "error" as "success" | "error" | "warning" | "info",
        title: "",
        message: "",
    });

    // 선택된 파일 목록
    const files = useFileUploadStore((state) => state.selectedFiles);

    // 선택 상태
    const selectedFiles = useFileUploadStore((state) => state.selectedFiles);
    const clearFiles = useFileUploadStore((state) => state.clearFiles);

    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const setIsFolderMode = useFileToggleStore((state) => state.setIsFolderMode);

    // 파일 메타데이터 초기화
    const clearAllMetadata = useFileMetaDataStore((state) => state.clearAllMetadata);
    const clearSelectedFileIndex = useFileSelectionStore((state) => state.clearSelectedFileIndex);
    const clearSelectedFileIndices = useFileMultiSelectionStore((state) => state.clearSelectedFileIndices);

    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
    
    const handleReset = () => {
        clearFiles();
        clearAllMetadata();
        clearSelectedFileIndex();
        clearSelectedFileIndices();
    }
    // TODO 업로드 로직 추가
    const handleUpload = async () => {
        if (isFolderMode) {
            console.log("folder mode");
        } else {
            console.log("file mode");
            try {
                const validationResult = validateFileMetadata(files, fileMetadata);
                if (!validationResult.isValid) {
                    setAlertDialog({
                        isOpen: true,
                        type: "error",
                        title: "유효성 검사 실패",
                        message: validationResult.errors.join('\n'),
                    });
                    return;
                }

                if (files.length > 0) {
                    const fileInfo: FileInfo[] = files.map((file, index) => ({
                        name: file.name,
                        fileSize: file.size,
                        fileExtension: file.name.split('.').pop() || '',
                        mimeType: file.type,
                        file: file,
                        ...fileMetadata[index]
                    }));
                    const uploadDatas: UploadData[] = await fetchInitUpload(fileInfo, "INDIVIDUAL");
                    console.log(uploadDatas);

                    const uploadResp = await fetchUpload(uploadDatas);
                    console.log(uploadResp);
                    
                    const uploadComplete = await fetchUploadComplete(uploadResp);
                    console.log(uploadComplete);
                }
            } catch (err) {
                console.error("업로드 실패", err);
            }
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
        
        {/* AlertDialog */}
        <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog(prev => ({ ...prev, isOpen: open }))}>
            <AlertDialogContent
                className="p-6 w-[clamp(700px,95vw,900px)] min-w-[700px] max-w-[900px] min-h-[250px] max-h-[400px] 
                        bg-slate-50 font-pretendard text-slate-800 rounded-[18px] flex flex-col border border-gray-300"
            >
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className="text-[1.5rem] font-bold font-pretendard text-gray-700"
                    >
                        {alertDialog.title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="flex-1 overflow-auto my-2">
                    <AlertDialogDescription
                        className="whitespace-pre-wrap text-[1.1rem] font-pretendard text-gray-700"
                    >
                        {alertDialog.message}
                    </AlertDialogDescription>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className="font-pretendard cursor-pointer text-[1.15rem] bg-sky-500 text-white rounded-[10px] px-7 py-5.5 font-semibold hover:bg-sky-600"
                        onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                    >
                        확인
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>)
});

export default UploadButton;