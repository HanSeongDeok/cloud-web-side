// src/components/FileUploadList.tsx
import { useFileUploadStore } from "@/stores/useFileInputStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Trash2, FolderOpen, Info, Settings, FileX, RotateCcw } from "lucide-react";
import { memo } from "react";
import { UploadBox } from "./UploadBox";
import { useFileMultiSelectionStore, useFileSelectionStore } from "@/stores/useFileSelectionStore";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuLabel,
} from "./ui/context-menu";
import { useFileMetaDataStore } from "@/stores/useFileMetaDataStore";
import { handleDrop, handleFileChange } from "@/handlers/events/file.drop.handler";

const FileUploadList = memo(() => {
  /**
   * 업로드된 파일 목록
   */
  const files = useFileUploadStore((state) => state.selectedFiles);
  const setFiles = useFileUploadStore((state) => state.setSelectedFiles);

  /**
   * 선택된 파일 인덱스 목록
   */
  const selectedFileIndices = useFileMultiSelectionStore((state) => state.selectedFileIndices);
  const setSelectedFileIndices = useFileMultiSelectionStore((state) => state.setSelectedFileIndices);

  /**
   * 현재 디스플레이 되는 파일 인덱스
   */
  const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
  const setSelectedFileIndex = useFileSelectionStore((state) => state.setSelectedFileIndex);

  /**
   * 파일 메타데이터
   */
  const fileMetadata = useFileMetaDataStore((state) => state.fileMetadata);
  const setFileMetadata = useFileMetaDataStore((state) => state.setFileMetadata);
  const clearFileMetadata = useFileMetaDataStore((state) => state.clearFileMetadata);

  /**
   * 선택된 파일에 일괄 옵션 적용
   */
  const applyOptionsToSelectedFiles = () => {
    const selectedFiles = files.filter((_, i) => selectedFileIndices.includes(i));
    const baseFileMetadata = fileMetadata[selectedFileIndex];

    if(baseFileMetadata) {
      selectedFiles.forEach((_, index) => {
        setFileMetadata(index, baseFileMetadata);
      });
    }
  }

  const clearSelectedFiles = () => {
    selectedFileIndices.forEach((index) => {
      clearFileMetadata(index);
    });
  }

  const isSelected = (index: number) => {
    return selectedFileIndices.includes(index);
  }
  return (
    <div 
      className="w-full h-full flex flex-col"
    >
      <div className="font-bold text-sm mb-2">파일 ({files.length})</div>
      <ScrollArea 
        className="w-full h-120 mb-2 pr-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {files.map((file, index) => (
          <div key={`${file.name}-${file.lastModified}-${file.size}-${index}`} className="mb-1 grid">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Button
                  variant={isSelected(index) ? "secondary" : "outline"}
                  className={`h-18 flex justify-between items-center p-2 overflow-hidden transition-colors cursor-pointer ${
                    isSelected(index) ? 
                      'text-blue-500 font-extrabold hover:text-blue-500 bg-gray-900 hover:bg-gray-900': 
                      'bg-muted'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFileIndex(index);
                    setSelectedFileIndices(e);
                  }}
                >
                  <div className="flex-1 min-w-0 flex flex-col items-start overflow-hidden">
                    <div className="text-sm text-left truncate w-full">{file.name}</div>
                    <div className={`text-xs text-left truncate w-full ${
                      selectedFileIndices.includes(index) ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(file.lastModified).toLocaleDateString()} / {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                  <div 
                    className="ml-2 flex-shrink-0 p-1 rounded transition-colors text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFiles(files.filter((_, i) => i !== index));
                      clearFileMetadata(index);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-58 truncate max-w-full text-left">
                <ContextMenuItem className="h-11 cursor-pointer font-bold text-sm flex items-center gap-2 px-3">
                  <Info className="w-4 h-4 " />
                  파일 정보 보기
                </ContextMenuItem>
                <ContextMenuItem 
                  className="h-11 cursor-pointer font-bold text-sm flex items-center gap-2 px-3"
                  onClick={applyOptionsToSelectedFiles}
                >
                  <Settings className="w-4 h-4" />
                  선택 파일 옵션 일괄 적용
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="h-11 cursor-pointer font-bold text-sm flex items-center gap-2 px-3"
                  onClick={clearSelectedFiles}
                >
                  <RotateCcw className="w-4 h-4" />
                  선택 파일 초기화
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="h-11 cursor-pointer font-bold text-sm flex items-center gap-2 px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFiles(files.filter((_, i) => !selectedFileIndices.includes(i)));
                    clearFileMetadata(index);  
                  }}
                >
                  <FileX className="w-4 h-4" />
                  선택 파일 삭제
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <Separator />
          </div>
        ))}
      </ScrollArea>
      <UploadBox className="mt-4 w-full h-20 flex flex-col items-center 
          justify-center border border-dashed border-gray-300 
          rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative"/>
    </div>
  );
});

export default FileUploadList;