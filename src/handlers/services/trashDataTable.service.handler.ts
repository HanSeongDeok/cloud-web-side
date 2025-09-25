import { API_CONFIG, TRASH_CAN_DATA_TABLE } from "@/config/api.config";
import type { SearchInfoBody, SearchResponse } from "@/stores/useTableDataStore";

/**
 *
 * @param searchInfo - 검색 정보
 * @returns
 */
export const searchTrashData = async (
    searchInfo: SearchInfoBody
  ): Promise<SearchResponse> => {
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
  
      const data: SearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Search info search failed:", error);
      throw error;
    }
  };

  interface RestoreRequestBody {
    groupIds: number[];
    fileIds: number[];
  }
  
  interface RestoreResponse {
    success: boolean;
    message: string;
  }

export const restoreTrashData = async (data: RestoreRequestBody): Promise<RestoreResponse> => {
  const response = await fetch(`${API_CONFIG.baseURL}${TRASH_CAN_DATA_TABLE.restore}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`복구 요청 실패: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

interface DeleteRequestBody {
  groupIds: number[];
  fileIds: number[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
} 

export const deleteTrashData = async (data: DeleteRequestBody): Promise<DeleteResponse> => { 
  const response = await fetch(`${API_CONFIG.baseURL}${TRASH_CAN_DATA_TABLE.delete}`, {
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

