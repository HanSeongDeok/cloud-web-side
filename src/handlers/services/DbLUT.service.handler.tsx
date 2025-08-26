import { API_CONFIG, LUT_ITEM } from "@/api/api.config.ts";
import type { LutItem, NewLutItem } from "@/types/lut";
/**
 * 모든 룩업 아이템을 가져오는 함수
 * @returns Promise<LutItem[]> - 룩업 아이템 목록
 */
export const getAllLutItem = async (propertyId: number): Promise<LutItem[]> => {
  // 🔨 개발 중 Mock 데이터 반환 (나중에 제거)
  // return getMockLutItems();

  try {
    // 실제 API 호출
    const response = await fetch(
      `${API_CONFIG.baseURL}${LUT_ITEM.list(propertyId)}`
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
        result.message || "룩업 아이템 조회 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("룩업 아이템 데이터 로딩 성공:", result.message);
    return result.data || [];
  } catch (error) {
    console.error("getAllLutItem 에러:", error);
    throw error;
  }
};

/**
 * 새로운 룩업 아이템을 생성하는 함수
 * @param lutItem - 생성할 룩업 아이템 데이터 (id, sortOrder, createdAt, createdBy 제외)
 * @returns Promise<LutItem> - 생성된 룩업 아이템
 */
export const createLutItem = async (
  propertyId: number,
  lutItem: NewLutItem
): Promise<LutItem> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${LUT_ITEM.create(propertyId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lutItem),
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
        result.message || "룩업 아이템 생성 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("룩업 아이템 생성 성공:", result.message);
    return result.data;
  } catch (error) {
    console.error("createLutItem 에러:", error);
    throw error;
  }
};

/**
 * LUT 목록  (sortOrder) 순서 수정 함수
 * @param propertyId - 수정할 lut- ID
 * @param updates - 수정할 데이터
 * @returns Promise<DbProperty> - 수정된 속성
 */
export const updateSortOrder = async (
  propertyId: number,
  updates: LutItem[]
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${LUT_ITEM.sort(propertyId)}`,
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
        result.message || "LUT 순서 수정 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("LUT 순서 수정 성공:", result.message);
    return result.data;
  } catch (error) {
    console.error("updateSortOrder 에러:", error);
    throw error;
  }
};

/**
 * LUT 목록  (sortOrder) 순서 수정 함수
 * @param propertyId - 수정할 lut- ID
 * @param updates - 수정할 데이터
 * @returns Promise<DbProperty> - 수정된 속성
 */
export const updateLutItem = async (
  propertyId: number,
  updatedItem: LutItem
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${LUT_ITEM.update(propertyId, updatedItem.id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
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
        result.message || "LUT 아이템 수정 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("LUT 아이템 수정 성공:", result.message);
    return result.data;
  } catch (error) {
    console.error("updateLutItem 에러:", error);
    throw error;
  }
};

/**
 * LutItem을 삭제하는 함수
 * @param selectedId - 삭제할 LUT 아이템 ID
 * @returns Promise<{ success: boolean; message: string }> - 삭제 결과
 */
export const deleteLutItem = async (
  lutItemId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${LUT_ITEM.delete(lutItemId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
        result.message || "LUT 아이템 삭제 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("LUT 아이템 삭제 성공:", result.message);
    return {
      success: true,
      message: result.message || "룩업 아이템이 삭제되었습니다",
    };
  } catch (error) {
    console.error("deleteLutItem 에러:", error);
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
 * Mock 데이터 반환 함수 (개발용)
 */
function getMockLutItems(): LutItem[] {
  return [
    {
      id: 1,
      propertyMetadataId: 1,
      lutValue: "KONA",
      sortOrder: 1,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 KONA",
      isActive: true,
    },
    {
      id: 2,
      propertyMetadataId: 1,
      lutValue: "SANTA FE",
      sortOrder: 2,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 SANTA FE",
      isActive: true,
    },
    {
      id: 3,
      propertyMetadataId: 2,
      lutValue: "NEXO",
      sortOrder: 3,
      createdBy: 1,
      createdAt: new Date(),
      description: "NEXO 수소차",
      isActive: false,
    },
    {
      id: 4,
      propertyMetadataId: 4,
      lutValue: "TUCSON",
      sortOrder: 4,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 TUCSON",
      isActive: true,
    },
    {
      id: 5,
      propertyMetadataId: 5,
      lutValue: "PALISADE",
      sortOrder: 5,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 PALISADE",
      isActive: true,
    },
    {
      id: 6,
      propertyMetadataId: 1,
      lutValue: "GENESIS G90",
      sortOrder: 6,
      createdBy: 1,
      createdAt: new Date(),
      description: "제네시스 G90",
      isActive: true,
    },
    {
      id: 7,
      propertyMetadataId: 1,
      lutValue: "GENESIS GV70",
      sortOrder: 7,
      createdBy: 1,
      createdAt: new Date(),
      description: "제네시스 GV70",
      isActive: true,
    },
    {
      id: 8,
      propertyMetadataId: 2,
      lutValue: "IONIQ 5",
      sortOrder: 8,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 IONIQ 5",
      isActive: true,
    },
    {
      id: 9,
      propertyMetadataId: 2,
      lutValue: "IONIQ 6",
      sortOrder: 9,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 IONIQ 6",
      isActive: true,
    },
    {
      id: 10,
      propertyMetadataId: 3,
      lutValue: "AVANTE",
      sortOrder: 10,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 AVANTE",
      isActive: true,
    },
    {
      id: 11,
      propertyMetadataId: 3,
      lutValue: "SONATA",
      sortOrder: 11,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 SONATA",
      isActive: true,
    },
    {
      id: 12,
      propertyMetadataId: 4,
      lutValue: "GRANDEUR",
      sortOrder: 12,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 GRANDEUR",
      isActive: true,
    },
    {
      id: 13,
      propertyMetadataId: 4,
      lutValue: "VENUE",
      sortOrder: 13,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 VENUE",
      isActive: false,
    },
    {
      id: 14,
      propertyMetadataId: 5,
      lutValue: "CASPER",
      sortOrder: 14,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 CASPER",
      isActive: true,
    },
    {
      id: 15,
      propertyMetadataId: 5,
      lutValue: "STARIA",
      sortOrder: 15,
      createdBy: 1,
      createdAt: new Date(),
      description: "현대자동차 STARIA",
      isActive: true,
    },
  ];
}
// function getMockLutItems(): LutItem[] | PromiseLike<LutItem[]> {
//   throw new Error("Function not implemented.");
// }
