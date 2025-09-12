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

interface FilterColumnHeaderSelectionState extends SingleSelectState {}
interface FilterLutSelectionState extends MultiSelectStateV2 {}
interface TypeSelectionState extends MultiSelectState {}
interface FilterAdvancedSelectionState extends MultiSelectStateV2 {}

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
 * @deprecated
 * 파일 및 그룹 타입 선택 상태 관리
 */
export const useTypeSelectionStore = create<TypeSelectionState>((set, get) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
  isAllChecked: {},
  setAllChecked: (key: string, boolean: boolean) => set({ isAllChecked: { ...get().isAllChecked, [key]: boolean } }),
  clearAll: () => set({ selected: [] }),
}));

/**
 * 필터 컬럼 헤더 선택 상태 관리
 */
export const useFilterColumnHeaderSelectionStore = create<FilterColumnHeaderSelectionState>((set, get) => ({
  selected: "",
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: "" }),
}));

/**
 * 필터 속성(LUT) 선택 상태 관리
 */
export const useFilterLutSelectionStore = create<FilterLutSelectionState>((set, get) => ({
  selected: new Map<string, string[]>() ,
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: new Map<string, string[]>() }),
}));

/**
 * Advanced Search 선택 상태 관리
 */
export const useFilterAdvancedSelectionStore = create<FilterAdvancedSelectionState>((set, get) => ({
  selected: new Map<string, string[]>() ,
  setSelected: (selected) => set({ selected }),
  clearAll: () => set({ selected: new Map<string, string[]>() }),
}));


