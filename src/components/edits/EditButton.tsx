import { memo, useRef } from "react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
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
import { useFileToggleStore, useFileUploadStore, useEditModalStore } from "@/stores/useFileInputStore";
import FileUploadResizablePanel from "../uploads/FileUploadResizablePanel";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { useFileMultiSelectionStore, useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useState, useEffect } from "react";
import Toggle from "../ui/toggle";
import { fetchEdit, fetchGroupEdit, fetchUpload, fetchGroupComplete } from "@/handlers/services/upLoad.service.handler";
import { validateFileMetadata } from "@/handlers/events/upload.validation.handler";
import { deleteStorageData } from "@/handlers/services/StorageDataTable.service.handler";
import { convertSearchMode, createfilterInfo } from "@/handlers/events/filterSearch.service.handler";
import { type SearchInfoBody, useDataTableStore } from "@/stores/useTableDataStore";
import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { useFilterLutSelectionStore } from "@/stores/useSelectionStore";

// File 타입을 확장한 커스텀 타입
interface ExtendedFile extends File {
    isNewFile?: boolean;
    registrationNumber?: string | number;
    path?: (string | number)[];
    fileName?: string;
    originalName?: string;
}

// 공통 유틸리티 함수들
const extractFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1) : '';
};

const createFileEditInfo = (file: File, metadata: any, parentData?: any): FileEditInfo => {
    const fileExtension = extractFileExtension(file.name);

    return {
        fileId: Number(metadata.registrationNumber) || 0,
        name: file.name,
        fileSize: file.size > 0 ? file.size : 1024,
        fileExtension: fileExtension,
        mimeType: file.type || 'text/plain',
        file: file,
        description: metadata.description || '',
        vehicle: metadata.vehicle || '',
        testResult: metadata.testResult || '',
        ptType: metadata.ptType || '',
        ecu: metadata.ecu || '',
        devType: metadata.devType || '',
        testClassification: metadata.testClassification || '',
        devStep: metadata.devStep || '',
        testItem: metadata.testItem || '',
        tcNum: metadata.tcNum || '',
        swVer: metadata.swVer || '',
        deliverableType: metadata.deliverableType || '',
        customMetadata: metadata.customMetadata || {},
        // 그룹 관련 정보 추가
        groupId: parentData?.registrationNumber ? Number(parentData.registrationNumber) : undefined,
        groupName: parentData?.groupName || undefined,
        groupDescription: parentData?.groupDescription || undefined
    };
};

const showValidationError = (setAlertDialog: any, errors: string[]) => {
    setAlertDialog({
        isOpen: true,
        type: "error",
        title: "유효성 검사 실패",
        message: errors.join('\n'),
    });
};

const showError = (setAlertDialog: any, title: string, message: string) => {
    setAlertDialog({
        isOpen: true,
        type: "error",
        title: title,
        message: message,
    });
};

const showSuccessMessage = (existingFiles: FileEditInfo[], newFiles: FileEditInfo[]) => {
    let message = "그룹 파일 편집이 성공적으로 완료되었습니다.";
    if (existingFiles.length > 0 && newFiles.length > 0) {
        message = `기존 파일 ${existingFiles.length}개 수정, 새 파일 ${newFiles.length}개 추가가 완료되었습니다.`;
    } else if (existingFiles.length > 0) {
        message = `기존 파일 ${existingFiles.length}개 수정이 완료되었습니다.`;
    } else if (newFiles.length > 0) {
        message = `새 파일 ${newFiles.length}개 추가가 완료되었습니다.`;
    }
    window.alert(message);
};

const processExistingFiles = async (existingFiles: FileEditInfo[]): Promise<{ success: boolean; error?: string }> => {
    if (existingFiles.length === 0) {
        return { success: true };
    }

    console.log('기존 파일 메타데이터 수정 시작');
    const updateResults = await fetchEdit(existingFiles, "GROUP");
    console.log('기존 파일 수정 결과:', updateResults);

    const hasError = updateResults.some(result => result.error);
    if (hasError) {
        return { success: false, error: "기존 파일 수정 중 오류 발생" };
    }

    return { success: true };
};

const processNewFiles = async (newFiles: FileEditInfo[], groupId: number): Promise<{ success: boolean; error?: string }> => {
    if (newFiles.length === 0) {
        return { success: true };
    }

    console.log('새 파일 그룹 추가 시작');

    try {
        // 1. 그룹 파일 추가 초기화 (presigned URL 받기)
        const initResults = await fetchGroupEdit(newFiles, groupId);
        console.log('새 파일 초기화 결과:', initResults);
        console.log('initResults.data:', initResults.data);
        console.log('initResults.data.files:', initResults.data?.files);
        console.log('initResults.sessionId:', initResults.sessionId);
        console.log('initResults.data.sessionId:', initResults.data?.sessionId);

        if (!initResults.success) {
            return { success: false, error: "새 파일 초기화 중 오류 발생" };
        }

        // 2. 파일 업로드 (S3에 직접 업로드)
        const files = initResults.data?.files || initResults.files || [];
        const sessionId = initResults.data?.sessionId || initResults.sessionId;
        console.log('업로드할 파일들:', files);
        console.log('세션 ID:', sessionId);

        if (!sessionId) {
            throw new Error('세션 ID를 가져올 수 없습니다.');
        }

        const uploadResults = await fetchUpload(files.map((file: any, index: number) => ({
            sessionId: sessionId,
            id: file.id,
            presignedUrl: file.presignedUrl,
            type: file.type,
            file: newFiles[index].file
        })));

        console.log('파일 업로드 결과:', uploadResults);

        // 3. 그룹 파일 추가 완료 처리
        const completeResults = await fetchGroupComplete(uploadResults.sessionId, uploadResults.files.map((file: any, index: number) => ({
            ...newFiles[index],
            etag: file.etag,
            multipartParts: file.multipartParts
        })));

        console.log('새 파일 완료 결과:', completeResults);

        if (!completeResults.success) {
            return { success: false, error: "새 파일 완료 처리 중 오류 발생" };
        }

        return { success: true };
    } catch (error) {
        console.error('새 파일 추가 중 오류:', error);
        return { success: false, error: "새 파일 추가 중 오류 발생" };
    }
};

const forceCleanupFocusTrap = () => {
    // 모든 aria-hidden 속성 제거
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
        el.removeAttribute('aria-hidden');
    });
    // inert 속성 제거
    document.body.removeAttribute('inert');
    document.querySelectorAll('[inert]').forEach(el => {
        el.removeAttribute('inert');
    });
    // Radix UI 관련 속성 제거
    document.querySelectorAll('[data-radix-focus-scope]').forEach(el => {
        el.removeAttribute('data-radix-focus-scope');
    });
    // 모든 요소의 pointer-events 복원
    document.querySelectorAll('*').forEach(el => {
        const element = el as HTMLElement;
        if (element.style.pointerEvents === 'none') {
            element.style.pointerEvents = '';
        }
    });
    // body의 모든 스타일 속성 복원
    document.body.style.pointerEvents = '';
    document.body.style.userSelect = '';
    // 포커스 복원
    const gridContainer = document.querySelector('.ag-grid-container') as HTMLElement;
    if (gridContainer) {
        gridContainer.focus();
    } else {
        document.body.focus();
    }
};

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

export interface FileEditInfo {
    fileId: number;
    name: string;
    fileSize: number;
    fileExtension: string;
    file: File;
    mimeType: string;
    etag?: string;
    multipartParts?: Array<{
        partNumber: number;
        etag: string;
    }>;
    // 그룹 관련 필드들
    groupId?: number;
    groupName?: string;
    groupDescription?: string;
    [key: string]: any;
}

const EditButton = memo(() => {
    const showEditModal = useEditModalStore((state) => state.showEditModal);
    const setShowEditModal = useEditModalStore((state) => state.setShowEditModal);
    // 알람 다이얼로그 상태
    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        type: "error" as "success" | "error" | "warning" | "info",
        title: "",
        message: "",
    });

    // 선택된 파일 목록
    const files = useFileUploadStore((state) => state.selectedFiles);
    const clearFiles = useFileUploadStore((state) => state.clearFiles);
    const fetchSearchData = useDataTableStore((state) => state.fetchSearchData);
    const searchKeyword = useSearchKeywordStore((state) => state.searchKeyword);
    const filterLutSected = useFilterLutSelectionStore((state) => state.selected);
    const paginationInfo = useDataTableStore((state) => state.pagination);
    const deepCopiedFilesRef = useRef<ExtendedFile[] | null>(null);
    const isFolderMode = useFileToggleStore((state) => state.isFolderMode);

    useEffect(() => {
        if (deepCopiedFilesRef.current === null && files.length > 0) {
            deepCopiedFilesRef.current = files.map(f => ({ ...f }));
        }
    }, [files]);

    // 파일 메타데이터 초기화
    const clearAllMetadata = useFileMetaDataStore((state) => state.clearAllMetadata);
    const clearSelectedFileIndex = useFileSelectionStore((state) => state.clearSelectedFileIndex);
    const clearSelectedFileIndices = useFileMultiSelectionStore((state) => state.clearSelectedFileIndices);

    const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);

    // 포커스 트랩 문제 해결을 위한 useEffect
    useEffect(() => {
        if (!showEditModal) {
            // 여러 번 시도하여 확실하게 해제
            const timers = [
                setTimeout(forceCleanupFocusTrap, 10),
                setTimeout(forceCleanupFocusTrap, 50),
                setTimeout(forceCleanupFocusTrap, 100),
                setTimeout(forceCleanupFocusTrap, 200),
                setTimeout(forceCleanupFocusTrap, 500)
            ];

            return () => {
                timers.forEach(timer => clearTimeout(timer));
            };
        }
    }, [showEditModal]);

    const handleReset = () => {
        clearFiles();
        clearAllMetadata();
        clearSelectedFileIndex();
        clearSelectedFileIndices();
    }
    const handleFolderModeUpload = async () => {
        const validationResult = validateFileMetadata(files, fileMetadata);
        if (!validationResult.isValid) {
            showValidationError(setAlertDialog, validationResult.errors);
            return;
        }

        if (files.length === 0) {
            return handleDelete();
        }

        console.log('선택된 파일들:', files);
        console.log('파일 메타데이터:', fileMetadata);

        // parentData에서 groupId 추출
        const parentData = fileMetadata[0]?.parentData;
        const groupId = parentData?.registrationNumber ? Number(parentData.registrationNumber) : null;

        if (!groupId) {
            showError(setAlertDialog, "그룹 ID 오류", "그룹 ID를 찾을 수 없습니다.");
            return;
        }

        const fileEditInfo: FileEditInfo[] = files.map((file, index) => {
            const metadata = fileMetadata[index] || {};
            const fileInfo = createFileEditInfo(file, metadata, parentData);
            console.log(`파일 ${index} 정보:`, fileInfo);
            console.log(`파일 ${index} isNewFile:`, (file as ExtendedFile).isNewFile);
            return fileInfo;
        });

        // 새 파일과 기존 파일 구분
        const newFiles = fileEditInfo.filter(file => (file.file as ExtendedFile).isNewFile === true);
        const existingFiles = fileEditInfo.filter(file => (file.file as ExtendedFile).isNewFile !== true);

        console.log('새 파일들:', newFiles);
        console.log('기존 파일들:', existingFiles);

        try {
            // 기존 파일 처리
            const existingResult = await processExistingFiles(existingFiles);
            if (!existingResult.success) {
                window.alert(`그룹 파일 편집이 실패하였습니다: ${existingResult.error}`);
                return;
            }

            // 새 파일 처리
            const newResult = await processNewFiles(newFiles, groupId);
            if (!newResult.success) {
                window.alert(`그룹 파일 편집이 실패하였습니다: ${newResult.error}`);
                return;
            }

            showSuccessMessage(existingFiles, newFiles);
        } catch (err) {
            console.error("그룹 편집 실패", err);
            showError(setAlertDialog, "그룹 편집 실패", err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
        }
    };

    const handleFileModeUpload = async () => {
        const validationResult = validateFileMetadata(files, fileMetadata);
        if (!validationResult.isValid) {
            showValidationError(setAlertDialog, validationResult.errors);
            return;
        }

        if (files.length === 0) {
            return handleDelete();
        }

        console.log('선택된 파일들:', files);
        console.log('파일 메타데이터:', fileMetadata);

        const fileEditInfo: FileEditInfo[] = files.map((file, index) => {
            const metadata = fileMetadata[index] || {};
            const fileInfo = createFileEditInfo(file, metadata);
            console.log(`파일 ${index} 정보:`, fileInfo);
            console.log(`파일 ${index} fileId:`, fileInfo.fileId);
            console.log(`파일 ${index} fileId 타입:`, typeof fileInfo.fileId);
            return fileInfo;
        });

        try {
            const results = await fetchEdit(fileEditInfo, "INDIVIDUAL") as any;
            console.log(results);

            if (results.success) {
                window.alert("파일 편집이 성공적으로 완료되었습니다.");
            } else {
                window.alert("파일 편집이 실패하였습니다.");
            }
        } catch (err) {
            console.error("업로드 실패", err);
        }
    };

    const handleUpload = async () => {
        if (isFolderMode) {
            console.log("folder mode");
            await handleFolderModeUpload();
        } else {
            console.log("file mode");
            await handleFileModeUpload();
        }
    }

    const handleDelete = async () => {
        if (!deepCopiedFilesRef.current || deepCopiedFilesRef.current.length === 0) {
            window.alert("삭제할 파일이 없습니다.");
            return;
        }

        let fileNames: string[] = [];
        if (deepCopiedFilesRef.current && deepCopiedFilesRef.current.length > 0) {
            fileNames = deepCopiedFilesRef.current.map((file: ExtendedFile) => 
                file.name || file.fileName || file.originalName || "이름없음");
            console.log("삭제할 파일 이름들:", fileNames);
        }
        const confirmed = window.confirm("선택된 파일들을 삭제하시겠습니까? \n" + fileNames.join("\n"));
        if (!confirmed) return;

        try {
            // 파일 ID들을 추출
            const fileIds: number[] = [];
            const groupIds: number[] = [];

            deepCopiedFilesRef.current.forEach((file: ExtendedFile) => {
                if (isFolderMode) {
                    const groupId = file.path?.[0];
                    if (groupId) {
                        groupIds.push(Number(groupId));
                    }
                } else {
                    const fileId = file.registrationNumber;
                    if (fileId) {
                        fileIds.push(Number(fileId));
                    }
                }
            });

            const deleteRequestBody = {
                groupIds,
                fileIds
            };

            console.log("삭제 요청 바디:", deleteRequestBody);

            const result = await deleteStorageData(deleteRequestBody);

            if (result.success) {
                window.alert("파일이 성공적으로 삭제되었습니다.");
                const mode = convertSearchMode(searchKeyword);
                const searchInfo = createfilterInfo(
                    filterLutSected,
                    paginationInfo,
                    searchKeyword,
                    mode
                );

                fetchSearchData(searchInfo as SearchInfoBody);
                handleCancel(); // 모달 닫기
            } else {
                window.alert("파일 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 실패:", error);
            window.alert("파일 삭제 중 오류가 발생했습니다.");
        }
    };

    const handleCancel = () => {
        handleReset();
        setShowEditModal(false);

        // 즉시 실행 + 여러 번 시도
        forceCleanupFocusTrap();
        setTimeout(forceCleanupFocusTrap, 10);
        setTimeout(forceCleanupFocusTrap, 50);
        setTimeout(forceCleanupFocusTrap, 100);
        setTimeout(forceCleanupFocusTrap, 200);
        setTimeout(forceCleanupFocusTrap, 500);
    }

    return (
        <>
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent
                    className="flex flex-col resize overflow-hidden border-2 border-blue-200 rounded-lg shadow-lg bg-white"
                    style={{
                        width: 'clamp(320px, 95vw, 2200px)',
                        height: 'clamp(400px, 95vh, 2000px)',
                        minWidth: 600,
                        minHeight: 800,
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>파일 편집</DialogTitle>
                        <DialogDescription>
                            선택된 파일을 편집하세요.
                        </DialogDescription>
                    </DialogHeader>
                    {/* 파일 및 폴더 선택 토글 */}
                    <div className="flex items-center space-x-2 mt-1 ml-2">
                        <Toggle
                            checked={isFolderMode}
                            onChange={() => { }}
                            disabled={true}
                        />
                        <span className="text-xl ml-5 font-bold text-gray-500">
                            {isFolderMode ? '폴더' : '파일'}
                        </span>
                    </div>
                    <Separator className="h-0.5 bg-gray-300/50 opacity-100" />
                    <FileUploadResizablePanel />
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
                            <Button className="bg-white hover:bg-gray-100 border border-gray-400 h-12 w-30 cursor-pointer" variant="default" onClick={handleUpload}>편집</Button>
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

export default EditButton;