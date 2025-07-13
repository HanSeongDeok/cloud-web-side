import { memo } from "react";
import { Button } from "./ui/button";
import { RefreshCcw, Upload, UploadCloud } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog";
import { Separator } from "@components/ui/separator";
import { Input } from "@components/ui/input";
import { useUploadIsOpenStore } from "@/stores/useIsDialogOpenStore";
import { useFileInputStore, useFileToggleStore } from "@/stores/useFileInputStore";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";


const UploadButton = memo(() => {
    // 업로드 다이얼로그 열기 닫기
    const isOpen = useUploadIsOpenStore((state) => state.isOpen);
    const setIsOpen = useUploadIsOpenStore((state) => state.setIsOpen);

    // 선택된 파일 상태
    const selectedFiles = useFileInputStore((state) => state.selectedFiles);
    const setSelectedFiles = useFileInputStore((state) => state.setSelectedFiles);
    const clearFiles = useFileInputStore((state) => state.clearFiles);

    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);
    const setIsFolderMode = useFileToggleStore((state) => state.setIsFolderMode);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const collectFilesFromDirectory = (dirEntry: any): File[] => {
        const files: File[] = [];
        const reader = dirEntry.createReader();
        const readEntries = () => {
            reader.readEntries(async (entries: any[]) => {
                for (const entry of entries) {
                    if (entry.isFile) {
                        entry.file((file: File) => {
                            files.push(file);
                        });
                    } else if (entry.isDirectory) {
                        const subFiles = collectFilesFromDirectory(entry);
                        files.push(...subFiles);
                    }
                }
            });
        };
        readEntries();
        return files;
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files: File[] = [];
        Array.from(e.dataTransfer.items).forEach((item) => {
            const entry = item.webkitGetAsEntry?.();
            if (entry?.isDirectory) {
                const subFiles = collectFilesFromDirectory(entry);
                files.push(...subFiles);
            } else {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        });

        if (files.length > 0) {
            setSelectedFiles([...selectedFiles, ...files]);
        }
    };

    const handleReset = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
            clearFiles();
        }
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

                {/* 업로드 박스 */}
                <div className="mt-2 w-full h-100 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative">
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        {selectedFiles.length > 0
                            ? `${selectedFiles.length}개 파일 선택됨`
                            : "파일 선택 또는 드래그"
                        }
                    </p>
                    <Input
                        id="fileInput"
                        type="file"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        multiple
                        accept="*/*"
                    />
                </div>

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