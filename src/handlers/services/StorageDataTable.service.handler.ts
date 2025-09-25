import { API_CONFIG, DATA_TABLE } from "@/config/api.config";
import type { ColumnArray, LutRules } from "@/stores/useColumnsStore";
import type { ApiStorageColumns, SearchInfoBody, SearchResponse } from "@/stores/useTableDataStore";

/**
 *
 * @returns
 */
export const fetchStorageColumns = async (): Promise<ColumnArray[]> => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.columns}`, {
    method: "GET",
    credentials: "include",
  });
  const data: ApiStorageColumns<ColumnArray[]> = await response.json();
  return data.data;
};

export const fetchStorageLutRules = async (): Promise<{data: LutRules[]}> => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.lutRules}`, {
    method: "GET",
    credentials: "include",
  });
  const data: {data: LutRules[]} = await response.json();
  console.log(data);
  return data;
};

/**
 *
 * @param searchInfo - 검색 정보
 * @returns
 */
export const searchStorageInfoData = async (
  searchInfo: SearchInfoBody
): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(searchInfo),
    });

    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Search info search failed:", error);
    throw error;
  }
};

interface DeleteRequestBody {
  groupIds: number[];
  fileIds: number[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const deleteStorageData = async (data: DeleteRequestBody): Promise<DeleteResponse> => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`삭제 요청 실패: ${response.status}`);
  }

  const result = await response.json();
  return result;
};