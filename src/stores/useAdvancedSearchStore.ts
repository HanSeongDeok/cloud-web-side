
import { create } from 'zustand';


interface AdvancedSearchStore {
    advancedSearch: Record<string, string | string[]>;
    setAdvancedSearch: (key: string, value: string | string[]) => void;
    clearAllAdvancedSearch: () => void;
}

export const useAdvancedSearchStore = create<AdvancedSearchStore>((set, get) => ({
    advancedSearch: {},

    setAdvancedSearch: (key: string, value: string | string[]) => {
        set((state) => ({
            advancedSearch: {
                ...state.advancedSearch,
                [key]: value,
            },
        }));
    },

    clearAllAdvancedSearch: () => {
        set({ advancedSearch: {} });
    },
})); 