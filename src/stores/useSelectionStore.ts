import { create } from "zustand";

interface SelectionState {
  selectedMap: Map<string, boolean>;
  setSelectedMap: (selectedMap: Map<string, boolean>) => void;
  isSelected: (nodeId: string) => boolean;
  clearSelection: () => void;
}

interface MultiSelectState {
  selected: string[];
  setSelected: (selected: string[]) => void;
  clearAll: () => void;
  changeAll: (options: object[]) => void;
}

interface VehicleSelectionState extends MultiSelectState {}
interface EcuSelectionState extends MultiSelectState {}
interface StepSelectionState extends MultiSelectState {}

/**
 * 테이블 노드 선택 상태 관리
 */
export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedMap: new Map<string, boolean>(),
  setSelectedMap: (selectedMap) => set({ selectedMap }),
  isSelected: (nodeId) => {
    return get().selectedMap.get(nodeId) ?? false;
  },
  clearSelection: () => set({ selectedMap: new Map<string, boolean>() }),
}));

/**
 * 배지 버튼 차량 선택 상태 관리
 */
export const useVehicleSelectionStore = create<VehicleSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: [] }),
  changeAll: (options: object[]) => set({ selected: [] }),
}));

/**
 * 배지 버튼 ECU 선택 상태 관리
 */
export const useEcuSelectionStore = create<EcuSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: [] }),
  changeAll: (options: object[]) => set({ selected: [] }),
}));

/**
 * 배지 버튼 단계 선택 상태 관리
 */
export const useStepSelectionStore = create<StepSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: [] }),
  changeAll: (options: object[]) => set({ selected: [] }),
}));



