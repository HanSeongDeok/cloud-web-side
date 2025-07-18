import { create } from "zustand";

interface PannelResizableState {
    leftPanelWidth: number;
    rightPanelWidth: number;
    setLeftPanelWidth: (width: number) => void;
    setRightPanelWidth: (width: number) => void;
}

export const usePannelResizableStore = create<PannelResizableState>((set, get) => ({
    leftPanelWidth: 30,
    rightPanelWidth: 70,
    setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
    setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
}));