import { create } from "zustand";
import { searchStorageInfoData } from "@/handlers/services/StorageDataTable.service.handler";
import { searchTrashCanInfoData, type PagedData } from "@/handlers/services/TrashCanDataTable.service.handler copy";
import { searchTrashData } from "@/handlers/services/trashDataTable.service.handler";

/* ====================== 타입 정의 ====================== */

/** API가 내려주는 원본 아이템(부모/자식 공통) */
export interface ApiItem {
  id?: string;
  type?: string; // "GROUP" | "FILE" | ...
  customMetadata?: Record<string, unknown>;
  children?: ApiItem[]; // GROUP일 경우 하위 요소
  // 기타 서버 필드들(이름, 작성자 등)도 들어올 수 있으니 넓게 허용
  [key: string]: unknown;
}

/** 스토리지 컬럼 응답 */
export interface ApiStorageColumns<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 서버 응답 payload(data) */
export interface SearchResponseData {
  items: ApiItem[];
  size: number;
  page: number; // 0-base
  totalPages: number;
  totalItems: number;
}

/** 서버 응답 */
export interface SearchResponse {
  data: SearchResponseData;
}

/** 화면 테이블에 뿌릴 평탄화된 행 형태 */
export interface DataRow {
  /** 서버의 id -> registrationNumber 로 표준화 */
  registrationNumber?: string;
  /** 계층 경로: 부모부터 본인까지의 id 누적 */
  path: string[];
  /** 서버의 type -> fileFormat 로 표준화 */
  type?: string;

  /** 서버에서 내려온 다른 기본 필드들 (name, owner, etc.) */
  [key: string]: unknown;
}

export interface PaginationInfo {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalRow: number;
}

export interface SearchInfoBody {
  mode: string;
  paging: {
    page: number;
    size: number;
  };
  q?: string;
  searchTarget?: string;
  [key: string]: unknown;
}

/* ====================== Zustand Store ====================== */

interface DataTableStore {
  // 데이터 관련
  data: DataRow[];
  pagination: PaginationInfo;

  setData: (data: DataRow[]) => void;
  setPagination: (pagination: PaginationInfo) => void;

  // 데이터 페칭 관련
  fetchSearchData: (searchInfo: SearchInfoBody) => Promise<void>;
  fetchTrashData: (searchInfo: SearchInfoBody) => Promise<void>;
}

export const useDataTableStore = create<DataTableStore>((set, get) => ({
  // 데이터 관련
  data: [],
  setData: (data) => set({ data }),

  // 페이지네이션 관련
  pagination: {
    pageSize: 10,
    currentPage: 1,
    totalPages: 0,
    totalRow: 0,
  },
  setPagination: (pagination) => set({ pagination }),

  // 데이터 페칭
  fetchSearchData: async (searchInfo: SearchInfoBody) => {
    try {
      const res: SearchResponse = await searchStorageInfoData(searchInfo);
      const payload = res?.data;

      let updateData: DataRow[] = [];
      if (payload && Array.isArray(payload.items)) {
        updateData = transformDataItems(payload.items);
      }

      // 디버그
      console.log(updateData);

      get().setData(updateData);
      get().setPagination({
        pageSize: payload?.size ?? 0,
        currentPage: (payload?.page ?? 0) + 1, // 1-base로 변환
        totalPages: payload?.totalPages ?? 0,
        totalRow: payload?.totalItems ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch search data:", error);
    }
  },
  fetchTrashData: async (searchInfo: SearchInfoBody) => {
    try {
      const res: SearchResponse = await searchTrashData(searchInfo);
      const payload = res?.data;

      let updateData: DataRow[] = [];
      if (payload && Array.isArray(payload.items)) {
        updateData = transformDataItems(payload.items);
      }

      // 디버그
      console.log(updateData);

      get().setData(updateData);
      get().setPagination({
        pageSize: payload?.size ?? 0,
        currentPage: (payload?.page ?? 0) + 1, // 1-base로 변환
        totalPages: payload?.totalPages ?? 0,
        totalRow: payload?.totalItems ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch search data:", error);
    }
  },
}));

/* ====================== 변환 유틸 ====================== */

/**
 * 루트 아이템들을 평탄화된 DataRow 배열로 변환
 * - 각 루트는 자신을 DataRow로 변환
 * - GROUP이면 children을 재귀적으로 평탄화하여 같은 계층으로 push
 */
const transformDataItems = (items: ApiItem[]): DataRow[] => {
  const rows: DataRow[] = [];
  const accChildren: DataRow[] = [];

  for (const item of items) {
    // 1) 부모 자신 변환
    const parentRow = normalizeItemToRow(item, /*parentPath*/ []);
    rows.push(parentRow);

    // 2) 자식 평탄화 (GROUP & children 존재 시)
    if (
      isGroup(parentRow) &&
      Array.isArray(item.children) &&
      item.children.length > 0
    ) {
      flattenChildren(item.children, parentRow.path, accChildren);
    }
  }

  // 3) 부모들과 자식들을 한 계층으로 합치기
  if (accChildren.length > 0) {
    return rows.concat(accChildren);
  }
  return rows;
};

/**
 * ApiItem -> DataRow 기본 변환
 * - id -> registrationNumber, path 초기화
 * - type -> fileFormat
 * - customMetadata 및 기타 필드는 병합
 */
const normalizeItemToRow = (item: ApiItem, parentPath: string[]): DataRow => {
  const row: DataRow = {
    path: parentPath.slice(), // 기본적으로 부모 path 복사
  };

  // id → registrationNumber, path 마지막에 id 추가
  if (typeof item.id === "string" && item.id.length > 0) {
    row.registrationNumber = item.id;
    row.path = [...row.path, item.id];
  }

  // type → fileFormat
  if (typeof item.type === "string" && item.type.length > 0) {
    row.type = item.type;
  }

  // customMetadata를 포함하여 나머지 필드도 보존
  // (id, type, children 제외한 모든 필드를 row에 병합)
  for (const [k, v] of Object.entries(item)) {
    if (k === "id" || k === "type" || k === "children") continue;
    // customMetadata는 전개하여 키를 올려주는 전략 (기존 코드와 유사)
    if (k === "customMetadata" && v && typeof v === "object") {
      for (const [ck, cv] of Object.entries(v as Record<string, unknown>)) {
        (row as Record<string, unknown>)[ck] = cv;
      }
    } else {
      (row as Record<string, unknown>)[k] = v;
    }
  }

  return row;
};

/**
 * GROUP 자식들을 재귀적으로 평탄화하여 acc에 push
 * - 각 child는 normalizeItemToRow로 DataRow화
 * - child에 더 깊은 children이 있으면 재귀
 */
const flattenChildren = (
  children: ApiItem[],
  parentPath: string[],
  acc: DataRow[]
): void => {
  for (const child of children) {
    const childRow = normalizeItemToRow(child, parentPath);
    acc.push(childRow);

    if (
      isGroup(childRow) &&
      Array.isArray(child.children) &&
      child.children.length > 0
    ) {
      flattenChildren(child.children, childRow.path, acc);
    }
  }
};

/** fileFormat이 GROUP인지 판별 (서버 type 표준화) */
const isGroup = (row: DataRow): boolean => row.type === "GROUP";
