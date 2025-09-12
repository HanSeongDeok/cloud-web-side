import { create } from "zustand";

interface FileSelectionState {
  selectedFileIndex: number;
  setSelectedFileIndex: (index: number) => void;
  clearSelectedFileIndex: () => void;
}

interface FileMultiSelectionState {
  selectedFileIndices: number[];
  setSelectedFileIndices: (e: React.MouseEvent) => void;
  clearSelectedFileIndices: () => void;
}

export const useFileSelectionStore = create<FileSelectionState>((set, get) => ({
  selectedFileIndex: 0,
  setSelectedFileIndex: (index) => set({ selectedFileIndex: index }),
  clearSelectedFileIndex: () => set({ selectedFileIndex: 0 }),
}));

export const useFileMultiSelectionStore = create<FileMultiSelectionState>((set, get) => ({
  selectedFileIndices: [0],
  setSelectedFileIndices: (e) => {
    const currentIndices = get().selectedFileIndices;
    const index = useFileSelectionStore.getState().selectedFileIndex;
    
    if (e?.ctrlKey || e?.metaKey) {
      if (currentIndices.includes(index)) {
        set({ selectedFileIndices: currentIndices.filter((i) => i !== index) });
      } else {
        set({ selectedFileIndices: [...currentIndices, index] });
      }
      return;
    } 
    
    if (e?.shiftKey && currentIndices.length > 0) {
      const lastSelected = currentIndices[currentIndices.length - 1];
      const start = Math.min(lastSelected, index);
      const end = Math.max(lastSelected, index);
      const rangeIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      set({ selectedFileIndices: rangeIndices });
      return;
    } 
    
    set({ selectedFileIndices: [index] });
  },
  clearSelectedFileIndices: () => {
    set({ selectedFileIndices: [0] });
  },
}));

