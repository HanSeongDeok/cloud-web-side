import { UploadCloud } from "lucide-react";
import { Input } from "./ui/input";
import { memo } from "react";
import { handleDrop, handleFileChange } from "@/handlers/file.drop.handler";

/**
 * 파일 업로드 박스
 */
export const UploadBox = memo(({ className }: { className?: string }) => {
    return (
        <div 
            className={className}
        >
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
                파일 선택 또는 파일 및 폴더 드래그
            </p>
            <Input
                id="fileInput"
                type="file"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                multiple
                accept="*/*"
            />
        </div>
    )
});
