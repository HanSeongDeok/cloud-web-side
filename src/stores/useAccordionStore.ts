import { create } from "zustand";

interface AccordionState {
    openItems: string[]
    setOpenItems: (items: string[]) => void
}

export const useAccordionStore = create<AccordionState>((set) => ({
    openItems: ['filter'],
    setOpenItems: (items) => set({ openItems: items }),
}))
