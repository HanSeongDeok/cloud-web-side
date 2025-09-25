
import { create } from 'zustand';


interface AdvancedSearchStore {
    advancedSearch: Record<string, string | string[]>;
    searchType: string;
    setAdvancedSearch: (key: string, value: string | string[]) => void;
    setSearchType: (searchType: string) => void;
    clearAllAdvancedSearch: () => void;
}

export const useAdvancedSearchStore = create<AdvancedSearchStore>((set, get) => ({
    advancedSearch: {},
    searchType: "ALL",

    setAdvancedSearch: (key: string, value: string | string[]) => {
        set((state) => ({
            advancedSearch: {
                ...state.advancedSearch,
                [key]: value,
            },
        }));
    },

    setSearchType: (searchType: string) => {
        set({ searchType });
    },

    clearAllAdvancedSearch: () => {
        set({ advancedSearch: {} });
    },
})); 