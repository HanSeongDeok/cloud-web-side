import { create } from "zustand";

interface IsOpenStore {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

interface IsUploadOpenStore extends IsOpenStore {}
interface IsFilterOpenStore extends IsOpenStore {}

export const useFilterIsOpenStore = create<IsFilterOpenStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));


export const useUploadIsOpenStore = create<IsUploadOpenStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
