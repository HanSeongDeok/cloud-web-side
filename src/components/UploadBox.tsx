import { UploadCloud } from "lucide-react";
import { Input } from "./ui/input";
import { memo } from "react";
import { useFileUploadStore } from "@/stores/useFileInputStore";

/**
 * 순서 보장이 되지 않는 가장 빠른 병렬 비동기 처리 방식
 */
const collectFilesFromDirectory2 = async (dirEntry: any): Promise<File[]> => {
    const files: File[] = [];
    const reader = dirEntry.createReader();
    const entries: any[] = await new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
    });

    await Promise.all(entries.map(async (entry) => {
        if (entry.isFile) {
            const file = await new Promise<File>((resolve, reject) =>
                entry.file(resolve, reject)
            );
            files.push(file);
            return;
        }
        const subFiles = await collectFilesFromDirectory2(entry);
        files.push(...subFiles);
    }));
    return files;
};

/**
 * 순서 보장되는 파일 수집 비동기 처리 방식 한줄
 * @param dirEntry 
 * @returns 
 */
const collectFilesFromDirectory3 = async (dirEntry: any): Promise<File[]> => {
    const files: File[] = [];
    const reader = dirEntry.createReader();

    await new Promise<any[]>((resolve, reject) => {
        reader.readEntries(resolve, reject);
    }).then(async (entries: any[]) => {
        entries.sort((a, b) => a.fullPath.localeCompare(b.fullPath));
        for (const entry of entries) {
            if (entry.isFile) {
                const file = await new Promise<File>((resolve, reject) =>
                    entry.file(resolve, reject)
                );
                files.push(file);
            } else if (entry.isDirectory) {
                const subFiles = await collectFilesFromDirectory3(entry);
                files.push(...subFiles);
            }
        }
    });
    return files;
};

/**
 * 순서 보장되는 파일 수집 비동기 처리 방식
 * @param dirEntry 
 * @returns 
 */
const collectFilesFromDirectory = async (dirEntry: any): Promise<File[]> => {
    const files: File[] = [];
    const reader = dirEntry.createReader();

    const entries: any[] = await new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
    });

    entries.sort((a, b) => a.fullPath.localeCompare(b.fullPath));

    for (const entry of entries) {
        if (entry.isFile) {
            const file = await new Promise<File>((resolve, reject) =>
                entry.file(resolve, reject)
            );
            files.push(file);
        } else if (entry.isDirectory) {
            const subFiles = await collectFilesFromDirectory(entry);
            files.push(...subFiles);
        }
    }
    return files;
}

/**
 * 파일 업로드 박스
 */
export const UploadBox = memo(({ className }: { className?: string }) => {
    const selectedFiles = useFileUploadStore((state) => state.selectedFiles);
    const setSelectedFiles = useFileUploadStore((state) => state.setSelectedFiles);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles([...selectedFiles, ...files]);
    };
    
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        const files: File[] = [];
        const items = Array.from(e.dataTransfer.items);
    
        for (const item of items) {
            const entry = item.webkitGetAsEntry?.();
            if (entry?.isDirectory) {
                const subFiles = await collectFilesFromDirectory(entry);
                files.push(...subFiles);
            } else {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
    
        if (files.length > 0) {
            setSelectedFiles([...selectedFiles, ...files]);
        }
    };

    return (
        <div className={className}>
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
