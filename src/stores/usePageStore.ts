import { create } from "zustand";

type Page = "page1" | "page2" | "page3";

interface PageStore {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  activePage: "page1",
  setActivePage: (page) => set({ activePage: page }),
}));
