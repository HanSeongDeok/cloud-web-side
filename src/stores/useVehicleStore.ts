import { create } from 'zustand';

interface VehicleState {
  vehicle: string;
  setVehicle: (vehicle: string) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicle: '',
  setVehicle: (vehicle) => set({ vehicle }),
})); 