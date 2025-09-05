import { API_CONFIG, WHITELIST } from "@/api/api.config.ts";
import type {
  WhitelistCollection,
  NewWhitelistGroup,
  UpdateWhitelistGroup,
  PermissionRequests,
} from "@/types/whitelist";

//TODO : 화이트리스트 검색 api 추가 필요

/**
 * 모든 화이트리스트 팀 구조 트리를 가져오는 함수
 * @param
 * @returns Promise<WhitelistCollection[]> - 화이트리스트 팀 구조 트리 목록
 */
export const getWhitelistCollection =
  async (): Promise<WhitelistCollection> => {
    // 🔨 개발 중 Mock 데이터 반환 (나중에 제거)
    // return getMockWhitelistCollection();

    try {
      // 실제 API 호출
      const response = await fetch(`${API_CONFIG.baseURL}${WHITELIST.list}`, {
        credentials: "include",
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
          result.message || "데이터 조회 중 오류가 발생했습니다";
        const errorCode = result.code ? `[${result.code}] ` : "";
        const statusInfo = result.status ? ` (Status: ${result.status})` : "";

        throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
      }

      // 성공 응답 구조: { success: true, data: T, message: string }
      console.log("화이트리스트 데이터 로딩 성공:", result.message);

      // WhitelistCollection 형태로 래핑
      if (Array.isArray(result.data)) {
        return { groups: result.data };
      }

      return result.data;
    } catch (error) {
      console.error("getWhitelistCollection 에러:", error);
      throw error;
    }
  };

/**
 * 화이트리스트 팀 구조에 그룹 추가를 하는 함수
 * @param groupData - 추가할 새 그룹 정보
 * @returns Promise<WhitelistCollection[]> - 화이트리스트 팀 구조 트리 목록
 */
export const addGroup = async (
  groupData: NewWhitelistGroup
): Promise<WhitelistCollection> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.createGroup}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(groupData),
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
      const errorMessage = result.message || "그룹 생성 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("그룹 생성 성공:", result.message);
    // WhitelistCollection 형태로 래핑
    if (Array.isArray(result.data)) {
      return { groups: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("addGroup 에러:", error);
    throw error;
  }
};

/**
 * 화이트리스트 팀 구조의 기존 그룹 수정하는 함수
 * @param groupId - 수정할 그룹 ID
 * @param groupData - 수정할 그룹 정보
 * @returns Promise<WhitelistCollection[]> - 화이트리스트 팀 구조 트리 목록
 */
export const updateGroup = async (
  groupId: number,
  groupData: UpdateWhitelistGroup
): Promise<WhitelistCollection> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.updateGroup(groupId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(groupData),
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
      const errorMessage = result.message || "그룹 수정 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("그룹 수정 성공:", result.message);
    // WhitelistCollection 형태로 래핑
    if (Array.isArray(result.data)) {
      return { groups: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("updateGroup 에러:", error);
    throw error;
  }
};

/**
 * 화이트리스트 팀 구조의 기존 그룹 삭제하는 함수
 * @param groupId - 삭제할 그룹 ID
 * @returns Promise<WhitelistCollection> - 화이트리스트 팀 구조 트리 목록
 */

export const deleteGroup = async (
  groupId: number
): Promise<WhitelistCollection> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.deleteGroup(groupId)}`,
      {
        method: "DELETE",
        credentials: "include",
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
      const errorMessage = result.message || "그룹 삭제 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("그룹 삭제 성공:", result.message);
    // WhitelistCollection 형태로 래핑
    if (Array.isArray(result.data)) {
      return { groups: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("deleteGroup 에러:", error);
    throw error;
  }
};

/**
 * 화이트리스트에서 사용자 제거 함수
 * @param userId - 삭제할 유저 ID
 * @returns Promise<WhitelistCollection[]> - 화이트리스트 팀 구조 트리 목록
 */

export const deleteUser = async (
  userId: number
): Promise<WhitelistCollection> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.deleteUser(userId)}`,
      {
        method: "DELETE",
        credentials: "include",
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
        result.message || "화이트리스트 유저 삭제 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("화이트리스트 유저 삭제 성공:", result.message);
    // WhitelistCollection 형태로 래핑
    if (Array.isArray(result.data)) {
      return { groups: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("deleteUser 에러:", error);
    throw error;
  }
};

/**
 * 화이트리스트에서 사용자 권한 회수
 * @param userId - 권한을 회수할 유저 ID
 * @returns Promise<WhitelistCollection[]> - 화이트리스트 팀 구조 트리 목록
 */

export const RevokeUserPermission = async (
  userId: number
): Promise<WhitelistCollection> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.deleteUser(userId)}`,
      {
        method: "PUT",
        credentials: "include",
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
        result.message || "화이트리스트 유저 권한 회수 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("화이트리스트 유저 권한 회수 성공:", result.message);
    // WhitelistCollection 형태로 래핑
    if (Array.isArray(result.data)) {
      return { groups: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("RevokeUserPermission 에러:", error);
    throw error;
  }
};

/**
 * 사용자를 서브 관리자로 승격시키는 함수
 * @param userIds - 승격시킬 유저 ID 목록
 * @returns
 */
export const promoteAdmin = async (userIds: number[]) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.promoteAdmin}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userIds }),
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
        result.message || "서브 관리자 승격 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("서브 관리자 승격 성공:", result.message);
    return result.data;
  } catch (error) {
    console.error("promoteAdmin 에러:", error);
    throw error;
  }
};

/**
 * 서브 관리자의 권한을 회수하고, 일반 사용자로 강등시키는 함수
 * @param userIds - 강등시킬 유저 ID 목록
 * @returns
 */
export const demoteAdmin = async (userIds: number[]) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.demoteAdmin}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userIds }),
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
        result.message || "서브관리자 권한 회수 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("서브 관리자 권한 회수 성공:", result.message);
    return result.data;
  } catch (error) {
    console.error("demoteAdmin 에러:", error);
    throw error;
  }
};

/**
 * 권한 요청 목록을 조회하는 함수
 * @param
 * @returns Promise<PermissionRequests> - 권한 요청 목록
 */
export const getPermissionRequests = async (): Promise<PermissionRequests> => {
  // 🔨 개발 중 Mock 데이터 반환 (나중에 제거)
  // return getMockPermissionRequests();

  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.permissionRequests}`,
      {
        credentials: "include",
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
        result.message || "권한 요청 목록을 조회 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("권한 요청 목록을 조회 성공:", result.message);
    if (Array.isArray(result.data)) {
      return { requests: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("getPermissionRequests 에러:", error);
    throw error;
  }
};

/**
 * 권한 요청을 승인하는 함수
 * @param requestIds - 승인할 권한 요청 ID 목록
 * @returns
 */
export const approvePermissionRequests = async (requestIds: number[]) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.approveRequests}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ requestIds }),
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
        result.message || "권한 요청 승인 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("권한 요청 승인 성공:", result.message);
    if (Array.isArray(result.data)) {
      return { requests: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("approvePermissionRequests 에러:", error);
    throw error;
  }
};

/**
 * 권한 요청을 거절하는 함수
 * @param requestIds - 거절할 권한 요청 ID 목록
 * @returns
 */
export const rejectPermissionRequests = async (requestIds: number[]) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${WHITELIST.rejectRequests}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ requestIds }),
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
        result.message || "권한 요청 거절 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("권한 요청을 거절 성공:", result.message);
    if (Array.isArray(result.data)) {
      return { requests: result.data };
    }
    return result.data;
  } catch (error) {
    console.error("rejectPermissionRequests 에러:", error);
    throw error;
  }
};

/**
 * 🔨 개발용 Mock 데이터 - 화이트리스트 팀 구조
 * 실제 API 연동 전까지 임시로 사용하는 데이터
 */
export const getMockWhitelistCollection = (): WhitelistCollection => {
  return {
    groups: [
      {
        id: 1,
        name: "차량 성능시험 팀",
        users: [
          {
            id: 1,
            email: "user01@company.com",
            name: "홍길동",
            employeeId: "001",
            team: "차량 성능시험 팀",
            role: "SUPER_ADMIN",
          },
        ],
        code: "TEAM001",
        whitelisted: false,
      },
      {
        id: 2,
        name: "차량제어기 시험 팀",
        users: [
          {
            id: 2,
            email: "user02@company.com",
            name: "장태민",
            employeeId: "002",
            team: "차량제어기 시험 팀",
            role: "USER",
          },
        ],
        code: "TEAM002",
        whitelisted: false,
      },
      {
        id: 3,
        name: "UX 팀",
        users: [
          {
            id: 3,
            email: "user03@company.com",
            name: "김상민",
            employeeId: "003",
            team: "UX 팀",
            role: "USER",
          },
          {
            id: 4,
            email: "user04@company.com",
            name: "김민주",
            employeeId: "004",
            team: "UX 팀",
            role: "ADMIN",
          },
        ],
        code: "TEAM003",
        whitelisted: false,
      },
    ],
  };
};

/**
 * 🔨 개발용 Mock 데이터 - 권한 요청 목록
 * 실제 API 연동 전까지 임시로 사용하는 데이터
 */
export const getMockPermissionRequests = (): PermissionRequests => {
  return {
    requests: [
      {
        id: 101,
        email: "request01@company.com",
        name: "이철수",
        employeeId: "E001",
        team: "개발팀",
      },
      {
        id: 102,
        email: "request02@company.com",
        name: "박영희",
        employeeId: "E002",
        team: "기획팀",
      },
      {
        id: 103,
        email: "request03@company.com",
        name: "김수현",
        employeeId: "E003",
        team: "QA팀",
      },
      {
        id: 104,
        email: "request04@company.com",
        name: "정민호",
        employeeId: "E004",
        team: "디자인팀",
      },
      {
        id: 105,
        email: "request05@company.com",
        name: "조현우",
        employeeId: "E005",
        team: "마케팅팀",
      },
    ],
  };
};
