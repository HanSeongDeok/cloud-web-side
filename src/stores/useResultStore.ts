import { create } from "zustand";

interface ResultState {
    result: string; 
    setResult: (result: string) => void;
}

const useResultStore = create<ResultState>((set) => ({
    result: "",
    setResult: (result) => set({ result }),
}));

export default useResultStore;