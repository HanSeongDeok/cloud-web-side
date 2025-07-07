import ProtoPage1 from "@/components/ProtoPage1";
import { create } from "zustand";

interface PageStore {
  activePage: React.FC;
  setActivePage: (page: React.FC) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  activePage: ProtoPage1,
  setActivePage: (page) => set({ activePage: page }),
}));
