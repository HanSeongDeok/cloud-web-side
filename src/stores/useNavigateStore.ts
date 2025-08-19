import MainPage from "@/components/pages/StoragePage";
import { create } from "zustand";

interface PageStore {
  activePage: React.FC;
  setActivePage: (page: React.FC) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  activePage: MainPage,
  setActivePage: (page) => set({ activePage: page }),
}));
