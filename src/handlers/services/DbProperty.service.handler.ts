import { API_CONFIG, DB_PROPERTY } from "@/config/api.config";
import type {
  DbProperty,
  NewDbProperty,
  PartialDbProperty,
} from "@/types/property";
import type { ColDef } from "ag-grid-community";
import { columnDefs, type Column } from "../events/property.config.handler";

// 🌐 API 기본 설정
const API_BASE_URL = "http://localhost:3001/api"; // 실제 API 서버 URL로 변경

/**
 * 모든 DB 속성을 가져오는 함수
 * @returns Promise<DbProperty[]> - DB 속성 목록
 */
export const getAllDbProperties = async (): Promise<DbProperty[]> => {
  try {
    // 실제 API 호출
    const response = await fetch(`${API_CONFIG.baseURL}${DB_PROPERTY.list}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "데이터 조회 중 오류가 발생했습니다");
    }

    return result.data || [];
  } catch (error) {
    console.error("fetchAllDbProperties 에러:", error);
    throw error;
  }
};

/**
 * 새로운 DB 속성을 생성하는 함수
 * @param property - 생성할 속성 데이터 (id 제외)
 * @returns Promise<DbProperty> - 생성된 속성
 */
export const createDbProperty = async (
  property: NewDbProperty
): Promise<DbProperty> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DB_PROPERTY.create}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(property),
    });

    if (!response.ok) {
      throw new Error(
        `속성 생성 실패: ${response.status} ${response.statusText}`
      );
    }

    // API 응답 파싱: { "success": true, "data": {...}, "error": null }
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "속성 생성 중 오류가 발생했습니다");
    }

    return result.data;
  } catch (error) {
    console.error("createDbProperty 에러:", error);
    throw error;
  }
};

/**
 * 기존 DB 속성을 수정하는 함수
 * @param id - 수정할 속성 ID
 * @param updates - 수정할 데이터 (부분 업데이트 가능)
 * @returns Promise<DbProperty> - 수정된 속성
 */
export const updateDbProperty = async (
  id: number,
  updates: Partial<DbProperty>
): Promise<DbProperty> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${DB_PROPERTY.update(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(
        `속성 수정 실패: ${response.status} ${response.statusText}`
      );
    }

    // API 응답 파싱: { "success": true, "data": {...}, "error": null }
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "속성 수정 중 오류가 발생했습니다");
    }

    return result.data;
  } catch (error) {
    console.error("updateDbProperty 에러:", error);
    throw error;
  }
};

/**
 * DB 속성을 삭제하는 함수
 * @param selectedIds - 삭제할 속성 ID 배열
 * @returns Promise<{ success: boolean; message: string }> - 삭제 결과
 */
export const deleteDbProperty = async (
  selectedIds: number[]
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DB_PROPERTY.delete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      throw new Error(
        `속성 삭제 실패: ${response.status} ${response.statusText}`
      );
    }

    // API 응답 파싱: { "success": true, "data": "파일 속성이 삭제되었습니다", "error": null }
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "삭제 처리 중 오류가 발생했습니다");
    }

    return {
      success: true,
      message: result.data || `${selectedIds.length}개의 속성이 삭제되었습니다`,
    };
  } catch (error) {
    console.error("deleteDbProperty 에러:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "삭제 중 알 수 없는 오류가 발생했습니다",
    };
  }
};

/**
 * 여러 DB 속성을 일괄 삭제하는 함수
 * @param ids - 삭제할 속성 ID 배열
 * @returns Promise<number> - 삭제된 항목 수
 */
export const deleteMultipleDbProperties = async (
  ids: number[]
): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/db-properties/batch-delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(
        `일괄 삭제 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.deletedCount || 0;
  } catch (error) {
    console.error("deleteMultipleDbProperties 에러:", error);
    throw error;
  }
};

// ==========================================
// 🔨 Mock 데이터 (개발용)
// ==========================================

/**
 * AG-Grid 컬럼 정의를 생성하는 함수
 * property.config.handler.tsx의 columnDefs 함수를 사용
 * @returns ColDef<DbProperty>[] - AG-Grid 컬럼 정의 배열
 */
export const getDbColumns = (): ColDef<PartialDbProperty>[] => {
  // property.config.handler.tsx에서 사용하는 Column 타입의 헤더 정보
  const columnHeaders: Column = {
    displayName: "이름",
    dataType: "타입",
    useLut: "참조표 사용",
    description: "설명",
    propertyType: "시스템 속성 여부",
  };

  // columnDefs 함수를 사용하여 기본 컬럼 생성
  const baseColumns = columnDefs(columnHeaders);

  // DbProperty 타입에 맞게 추가 컬럼들과 함께 반환
  return [
    ...(baseColumns.map((col) => ({
      ...col,
      sortable: true,
      filter: true,
      // 특별한 렌더링이 필요한 컬럼들 처리
      ...(col.field === "useLut" && {
        cellRenderer: (params: { value: number }) =>
          params.value === 1 ? "✅ 사용" : "❌ 미사용",
      }),
    })) as ColDef<PartialDbProperty>[]),
  ];
};
