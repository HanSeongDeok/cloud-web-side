
import { create } from 'zustand';


interface FileMetaDataStore {
    fileMetadata: Record<number, any>;
    setFileMetadata: (fileIndex: number, metadata: Partial<any>) => void;
    clearFileMetadata: (fileIndex: number) => void;
    clearAllMetadata: () => void;
}

export const useFileMetaDataStore = create<FileMetaDataStore>((set, get) => ({
    fileMetadata: {},
    
    setFileMetadata: (fileIndex: number, metadata: Partial<any>) => {
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