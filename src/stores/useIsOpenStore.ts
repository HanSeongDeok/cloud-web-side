import { create } from "zustand";

interface IsOpenStore {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useIsOpenStore = create<IsOpenStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));