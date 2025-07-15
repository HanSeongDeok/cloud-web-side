import { create } from "zustand";

interface FileSelectionState {
  selectedFileIndex: number;
  setSelectedFileIndex: (index: number) => void;
}

export const useFileSelectionStore = create<FileSelectionState>((set) => ({
  selectedFileIndex: 0,
  setSelectedFileIndex: (index) => set({ selectedFileIndex: index }),
}));