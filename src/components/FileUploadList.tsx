// src/components/FileUploadList.tsx
import { useFileUploadStore } from "@/stores/useFileInputStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Trash2 } from "lucide-react";
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

const FileUploadList = memo(() => {
  const files = useFileUploadStore((state) => state.selectedFiles);
  
  const selectedFileIndex = useFileSelectionStore((state) => state.selectedFileIndex);
  const setSelectedFileIndex = useFileSelectionStore((state) => state.setSelectedFileIndex);

  const selectedFileIndices = useFileMultiSelectionStore((state) => state.selectedFileIndices);
  const setSelectedFileIndices = useFileMultiSelectionStore((state) => state.setSelectedFileIndices);
  
  const isSelected = (index: number) => {
    return selectedFileIndices.includes(index);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="font-bold text-sm mb-2">파일 ({files.length})</div>
      <ScrollArea className="w-full h-120 mb-2 pr-4">
        {files.map((file, index) => (
          <div key={`${file.name}-${file.lastModified}-${file.size}-${index}`} className="mb-1 grid">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Button
                  variant={isSelected(index) ? "secondary" : "outline"}
                  className={`h-18 flex justify-between items-center p-2 overflow-hidden transition-colors ${
                    isSelected(index) ? 
                      'text-blue-500 font-extrabold hover:text-blue-500 bg-gray-900 hover:bg-gray-900': 
                      'bg-muted'
                  }`}
                  onClick={(e) => {
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
                    className="ml-2 flex-shrink-0 p-1 rounded cursor-pointer transition-colors text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-40 truncate max-w-full text-left">
                <ContextMenuItem>
                  삭제
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <Separator />
          </div>
        ))}
      </ScrollArea>
      <UploadBox className="mt-4 w-full h-20 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative"/>
    </div>
  );
});

export default FileUploadList;