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
  isAllChecked: { [key: string]: boolean };
  setAllChecked: (key: string, boolean: boolean) => void;
  clearAll: () => void;
}

interface MultiSelectStateV2 {
  selected: Map<string, string[]>;
  setSelected: (selected: Map<string, string[]>) => void;
  clearAll: () => void;
}

interface SingleSelectState {
  selected: string;
  setSelected: (selected: string) => void;
  clearAll: () => void;
}

interface VehicleSelectionState extends MultiSelectState {}
interface EcuSelectionState extends SingleSelectState {}
interface StepSelectionState extends MultiSelectStateV2 {}
interface TypeSelectionState extends MultiSelectState {}

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
 * 배지 버튼 타입 선택 상태 관리
 */
export const useTypeSelectionStore = create<TypeSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  isAllChecked: {},
  setAllChecked: (key: string, boolean: boolean) => set({ isAllChecked: { ...get().isAllChecked, [key]: boolean } }),
  clearAll: () => set({ selected: [] }),
}));

/**
 * 배지 버튼 차량 선택 상태 관리
 */
export const useVehicleSelectionStore = create<VehicleSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  isAllChecked: {},
  setAllChecked: (key: string, boolean: boolean) => set({ isAllChecked: { ...get().isAllChecked, [key]: boolean } }),
  clearAll: () => set({ selected: [] }),
}));

/**
 * 컬럼 헤더 선택 상태 관리
 */
export const useEcuSelectionStore = create<EcuSelectionState>((set, get) => ({
  selected: "",
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: "" }),
}));

/**
 * 배지 버튼 단계 선택 상태 관리
 */
export const useStepSelectionStore = create<StepSelectionState>((set, get) => ({
  selected: new Map<string, string[]>() ,
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: new Map<string, string[]>() }),
}));



