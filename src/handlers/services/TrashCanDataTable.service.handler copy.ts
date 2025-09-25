import { API_CONFIG, TRASH_CAN_DATA_TABLE } from "@/config/api.config";
import type { ColumnArray } from "@/stores/useColumnsStore";
import type { SearchInfoBody } from "@/stores/useTableDataStore";

// 공통 응답 구조
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 데이터 행 타입 (컬럼과 매칭되는 레코드)
export type TableRow = Record<string, unknown>;

// 페이지네이션 응답
export interface PagedData {
  content: TableRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 *
 * @returns
 */
export const fetchTrashCanColumns = async (): Promise<ColumnArray[]> => {
  const response = await fetch(
    `${API_CONFIG.baseURL}${TRASH_CAN_DATA_TABLE.columns}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data: ApiResponse<ColumnArray[]> = await response.json();
  return data.data;
};

/**
 *
 * @param searchInfo - 검색 정보
 * @returns
 */
export const searchTrashCanInfoData = async (
  searchInfo: SearchInfoBody
): Promise<ApiResponse<PagedData>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${TRASH_CAN_DATA_TABLE.data}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(searchInfo),
      }
    );

    const data: ApiResponse<PagedData> = await response.json();
    return data;
  } catch (error) {
    console.error("Search info search failed:", error);
    throw error;
  }
};
