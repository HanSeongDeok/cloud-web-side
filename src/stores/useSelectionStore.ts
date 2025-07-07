import { create } from "zustand";

interface SelectionState {
  selectedMap: Map<string, boolean>;
  setSelectedMap: (selectedMap: Map<string, boolean>) => void;
  isSelected: (nodeId: string) => boolean;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedMap: new Map<string, boolean>(),
  setSelectedMap: (selectedMap) => set({ selectedMap }),
  isSelected: (nodeId) => {
    return get().selectedMap.get(nodeId) ?? false;
  },
  clearSelection: () => set({ selectedMap: new Map<string, boolean>() }),
})); 