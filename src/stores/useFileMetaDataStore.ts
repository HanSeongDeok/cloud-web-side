import { create } from 'zustand';

export interface FileMetadata {
    deliverableType: string;
    testClassification: string;
    vehicle: string;
    driveType: string;
    devStep: string;
    ecu: string;
    testItem: string;
    result: string;
    memType: string;
}

interface FileMetaDataStore {
    fileMetadata: Record<number, FileMetadata>;
    setFileMetadata: (fileIndex: number, metadata: Partial<FileMetadata>) => void;
    getFileMetadata: (fileIndex: number) => FileMetadata;
    clearFileMetadata: (fileIndex: number) => void;
    clearAllMetadata: () => void;
}

export const useFileMetaDataStore = create<FileMetaDataStore>((set, get) => ({
    fileMetadata: {},
    
    setFileMetadata: (fileIndex: number, metadata: Partial<FileMetadata>) => {
        set((state) => ({
            fileMetadata: {
                ...state.fileMetadata,
                [fileIndex]: {
                    ...state.fileMetadata[fileIndex],
                    ...metadata,
                },
            },
        }));
    },
    
    getFileMetadata: (fileIndex: number) => {
        return get().fileMetadata[fileIndex] || {
            deliverableType: "",
            testClassification: "",
            vehicle: "",
            driveType: "",
            devStep: "",    
            ecu: "",
            testItem: "",
            result: "",
            memType: "",
        };
    },
    
    clearFileMetadata: (fileIndex: number) => {
        set((state) => {
            const newFileMetadata = { ...state.fileMetadata };
            delete newFileMetadata[fileIndex];
            return { fileMetadata: newFileMetadata };
        });
    },
    clearAllMetadata: () => {
        set({ fileMetadata: {} });
    },
})); 