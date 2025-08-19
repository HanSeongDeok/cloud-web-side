import { API_CONFIG, DB_PROPERTY } from "@/api/api.config.ts";
import type {
  DbProperty,
  NewDbProperty,
  PartialDbProperty,
} from "@/types/property";
import type { ColDef } from "ag-grid-community";
import { columnDefs, type Column } from "../events/property.config.handler";

/**
 * 모든 DB 속성을 가져오는 함수
 * @returns Promise<DbProperty[]> - DB 속성 목록
 */
export const getAllDbProperties = async (): Promise<DbProperty[]> => {
  // 🔨 개발 중 Mock 데이터 반환 (나중에 제거)
  return getMockDbProperties();

  //   try {
  //     // 실제 API 호출
  //     const response = await fetch(`${API_CONFIG.baseURL}${DB_PROPERTY.list}`);

  //     if (!response.ok) {
  //       throw new Error(
  //         `API 호출 실패: ${response.status} ${response.statusText}`
  //       );
  //     }

  //     const result = await response.json();

  //     if (!result.success) {
  //       // 실패 응답 구조: { success: false, status: number, code: string, message: string }
  //       const errorMessage = result.message || "DB 속성 조회 중 오류가 발생했습니다";
  //       const errorCode = result.code ? `[${result.code}] ` : "";
  //       const statusInfo = result.status ? ` (Status: ${result.status})` : "";

  //       throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
  //     }

  //     // 성공 응답 구조: { success: true, data: T, message: string }
  //     console.log("DB 속성 데이터 로딩 성공:", result.message);
  //     return result.data || [];
  //   } catch (error) {
  //     console.error("getAllDbProperties 에러:", error);
  //     throw error;
  //   }
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
      body: JSON.stringify(property),
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "DB 속성 생성 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("DB 속성 생성 성공:", result.message);
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
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "DB 속성 수정 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("DB 속성 수정 성공:", result.message);
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
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "DB 속성 삭제 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("DB 속성 삭제 성공:", result.message);
    return {
      success: true,
      message:
        result.message || `${selectedIds.length}개의 속성이 삭제되었습니다`,
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
    const response = await fetch(
      `${API_CONFIG.baseURL}/db-properties/batch-delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "DB 속성 일괄 삭제 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("DB 속성 일괄 삭제 성공:", result.message);
    return result.data?.deletedCount || 0;
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
export const getMockDbColumns = (): ColDef<PartialDbProperty>[] => {
  // property.config.handler.tsx에서 사용하는 Column 타입의 헤더 정보
  const columnHeaders: Column = {
    name: "이름",
    data_type: "타입",
    use_lut: "참조표 사용",
    description: "설명",
    property_type: "시스템 속성 여부",
  };

  // columnDefs 함수를 사용하여 기본 컬럼 생성
  const baseColumns = columnDefs(columnHeaders);

  return [
    ...(baseColumns.map((col) => ({
      ...col,
      sortable: true,
      filter: true,
      // 특별한 렌더링이 필요한 컬럼들 처리
      ...(col.field === "use_lut" && {
        cellRenderer: (params: { value: number }) =>
          params.value === 1 ? "✅ 사용" : "❌ 미사용",
      }),
    })) as ColDef<PartialDbProperty>[]),
  ];
};

/**
 * 개발용 Mock 데이터를 반환하는 함수
 * @returns DbProperty[] - Mock 속성 목록
 */
const getMockDbProperties = (): DbProperty[] => {
  return [
    {
      id: 1,
      name: "차종",
      data_type: "TEXT",
      property_type: "BUILT_IN",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-01T00:00:00Z"),
      updated_at: new Date("2024-01-01T00:00:00Z"),
      description: "차량 이름",
    },
    {
      id: 2,
      name: "개발단계",
      data_type: "TEXT",
      property_type: "BUILT_IN",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-02T00:00:00Z"),
      updated_at: new Date("2024-01-02T00:00:00Z"),
      description: "테스트 단계",
    },
    {
      id: 3,
      name: "TC #",
      data_type: "TEXT",
      property_type: "BUILT_IN",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-03T00:00:00Z"),
      updated_at: new Date("2024-01-03T00:00:00Z"),
      description: "테스트 케이스 그룹",
    },
    {
      id: 4,
      name: "시험 결과",
      data_type: "TEXT",
      property_type: "BUILT_IN",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-04T00:00:00Z"),
      updated_at: new Date("2024-01-04T00:00:00Z"),
      description: "테스트 결과",
    },
    {
      id: 5,
      name: "소프트웨어버전",
      data_type: "NUMBER",
      property_type: "BUILT_IN",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "SW 버전",
    },
    {
      id: 6,
      name: "산출물분류",
      data_type: "TEXT",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "산출물 분류 정보",
    },
    {
      id: 7,
      name: "마지막 로그인",
      data_type: "DATE",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "최근 로그인 시간",
    },

    {
      id: 8,
      name: "사용자 나이",
      data_type: "NUMBER",
      property_type: "USER_DEFINED",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 나이",
    },
    {
      id: 9,
      name: "사용자 성별",
      data_type: "TEXT",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 성별",
    },
    {
      id: 10,
      name: "사용자 지역",
      data_type: "TEXT",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 지역 정보",
    },
    {
      id: 11,
      name: "사용자 선호도",
      data_type: "TEXT",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 선호도 정보",
    },
    {
      id: 12,
      name: "사용자 활동 상태",
      data_type: "BOOLEAN",
      property_type: "USER_DEFINED",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 활동 상태",
    },
    {
      id: 13,
      name: "사용자 등급",
      data_type: "TEXT",
      property_type: "USER_DEFINED",
      use_lut: 1,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 등급 정보",
    },
    {
      id: 14,
      name: "사용자 가입일",
      data_type: "DATE",
      property_type: "USER_DEFINED",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 가입일 정보",
    },
    {
      id: 15,
      name: "사용자 생존 상태",
      data_type: "BOOLEAN",
      property_type: "USER_DEFINED",
      use_lut: 0,
      is_active: true,
      delete_request_status: "IN_USE",
      created_by: 1,
      created_at: new Date("2024-01-05T00:00:00Z"),
      updated_at: new Date("2024-01-05T00:00:00Z"),
      description: "사용자의 활동 상태",
    },
  ];
};
