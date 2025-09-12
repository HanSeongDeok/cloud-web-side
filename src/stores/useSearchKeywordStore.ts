import { create } from "zustand";

interface SearchKeywordState {
    searchKeyword: string;
    setSearchKeyword: (searchKeyword: string) => void;
}

export const useSearchKeywordStore = create<SearchKeywordState>((set) => ({
    searchKeyword: "",
    setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
}));