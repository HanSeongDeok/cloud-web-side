import { create } from "zustand";

interface FileTypeState {
    filetype: string;
    setFileType: (filetype:string) => void;
}

export const useFileTypeStore = create<FileTypeState>((set) => ({
    filetype: "",
    setFileType: (filetype) => set({ filetype }),
}));
