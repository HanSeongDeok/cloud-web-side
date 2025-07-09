import { create } from "zustand";

interface FilterUploaderState {
    uploader: string;
    setUploader: (uploader: string) => void;
}

export const useFilterUploaderStore = create<FilterUploaderState>((set) => ({
    uploader: "",
    setUploader: (uploader) => set({ uploader }),
}));