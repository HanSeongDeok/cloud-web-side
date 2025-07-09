import { create } from 'zustand';

interface StepState {
  step: string;
  setStep: (step: string) => void;
}

export const useStepStore = create<StepState>((set) => ({
  step: '',
  setStep: (step) => set({ step }),
})); 