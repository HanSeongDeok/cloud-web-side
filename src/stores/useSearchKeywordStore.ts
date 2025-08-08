import { searchData } from "@/handlers/services/dataTable.service.handler";
import { create } from "zustand";

interface SearchKeywordState {
    searchKeyword: string;
    setSearchKeyword: (searchKeyword: string) => void;
    searchData: (keyword: string) => Promise<any[]>;
}

export const useSearchKeywordStore = create<SearchKeywordState>((set) => ({
    searchKeyword: "",
    setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
    searchData: async (keyword) => {
        const data = await searchData(keyword);
        return data;
    }
}));