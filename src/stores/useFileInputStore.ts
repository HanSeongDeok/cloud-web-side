import { create } from "zustand";

interface FileUploadState {
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    clearFiles: () => void;
  }

interface FileToggleState {
    isFolderMode: boolean;
    setIsFolderMode: (isFolderMode: boolean) => void;
}

interface EditModalState {
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
    selectedFiles: [],
    setSelectedFiles: (files) => set({ selectedFiles: files }),
    clearFiles: () => set({ selectedFiles: [] }),
  }));

export const useFileToggleStore = create<FileToggleState>((set) => ({
    isFolderMode: false,
    setIsFolderMode: (isFolderMode) => set({ isFolderMode }),
}));

export const useEditModalStore = create<EditModalState>((set) => ({
    showEditModal: false,
    setShowEditModal: (show) => set({ showEditModal: show }),
}));