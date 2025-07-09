import { create } from "zustand";

interface FileNameState {
    fileName: string;   
    setFileName: (fileName: string) => void;
}

export const useFileNameStore = create<FileNameState>((set) => ({
    fileName: "",
    setFileName: (fileName) => set({ fileName }),
}));