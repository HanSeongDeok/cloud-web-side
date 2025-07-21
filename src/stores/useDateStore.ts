import { create } from "zustand";

interface DateState {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  startDate: "",
  endDate: "",
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));