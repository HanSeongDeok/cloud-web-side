import { create } from "zustand";

interface FileInputState {
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    clearFiles: () => void;
  }

interface FileToggleState {
    isFolderMode: boolean;
    setIsFolderMode: (isFolderMode: boolean) => void;
}

export const useFileInputStore = create<FileInputState>((set) => ({
    selectedFiles: [],
    setSelectedFiles: (files) => set({ selectedFiles: files }),
    clearFiles: () => set({ selectedFiles: [] }),
  }));

export const useFileToggleStore = create<FileToggleState>((set) => ({
    isFolderMode: false,
    setIsFolderMode: (isFolderMode) => set({ isFolderMode }),
}));