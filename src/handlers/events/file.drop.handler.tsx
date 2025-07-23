import { useFileUploadStore } from "@/stores/useFileInputStore";

const getFileUploadStore = () => useFileUploadStore.getState();

export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { selectedFiles, setSelectedFiles } = getFileUploadStore();

    const files = Array.from(e.target.files || []);
    const filteredFiles = files.filter((file) => !selectedFiles.some((f) => f.name === file.name));
    setSelectedFiles([...selectedFiles, ...filteredFiles]);
    e.target.value = '';
};

export const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { selectedFiles, setSelectedFiles } = getFileUploadStore();

    const files: File[] = [];
    const items = Array.from(e.dataTransfer.items || []);
    const fileList = Array.from(e.dataTransfer.files || []);
    const folderInfo: { name: string, size: number }[] = [];

    for (const item of items) {
        const entry = item.webkitGetAsEntry?.();
        if (entry?.isDirectory) {

            folderInfo.push({ name: entry.name, size: 0 });

            const subFiles = await collectFilesFromDirectory(entry);
            const filteredFiles = subFiles.filter((file) => !selectedFiles.some((f) => f.name === file.name));
            files.push(...filteredFiles);
        }
    }
    
    const tempFiles: File[] = [];
    for (const file of fileList) {
        const isFolder = folderInfo.some((folder) => 
            folder.name === file.name && folder.size === file.size
        );
        
        if (!isFolder && !selectedFiles.some((f) => f.name === file.name)) {
            tempFiles.push(file);
        }
    }

    files.unshift(...tempFiles);
    if (files.length > 0) {
        setSelectedFiles([...selectedFiles, ...files]);
    }
};

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
