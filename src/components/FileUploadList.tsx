// src/components/FileUploadList.tsx
import { useFileInputStore } from "@/stores/useFileInputStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Trash2 } from "lucide-react";
import { memo } from "react";
import { UploadBox } from "./UploadBox";


const FileUploadList = memo(() => {
  const files = useFileInputStore((state) => state.selectedFiles);
  return (
    <div className="w-full h-full flex flex-col">
      <div className="font-bold text-sm mb-2">파일 ({files.length})</div>
      <ScrollArea className="w-full h-110 mb-2 pr-4">
        {files.map((file) => (
          <div key={file.name} className="mb-1">
            <Button
              className="w-full h-18 flex justify-between items-center"
            >
              <div>
                <div className="font-medium max-w-[150px]">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {file.lastModified} / {file.size.toFixed(2)} MB
                </div>
              </div>
              <Button variant="ghost">
                <Trash2 className="w-2 h-2" />
              </Button>
            </Button>
            <Separator />
          </div>
        ))}
      </ScrollArea>
      <UploadBox className="mt-4 w-full h-20 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer bg-muted hover:bg-muted/50 relative"/>
    </div>
  );
});

export default FileUploadList;