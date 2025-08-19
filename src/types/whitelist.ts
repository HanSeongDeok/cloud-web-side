export type UserRole =
  | "ROLE_PERMISSION_REQUIRED" // 권한 필요
  | "ROLE_PERMISSION_REQUESTED" // 권한 요청됨
  | "ROLE_USER" // 일반 사용자
  | "ROLE_ADMIN" // 관리자
  | "ROLE_SUPER_ADMIN"; // 최고 관리자

export interface WhitelistUser {
  id: number;
  email: string;
  name: string;
  employeeId: string;
  role: UserRole;
  team: string;
}

// 그룹 정보 인터페이스
export interface WhitelistGroup {
  id: number;
  name: string;
  code: string;
  whitelisted: boolean;
  users: WhitelistUser[];
}

// 전체 화이트리스트 팀 구조
export interface WhitelistCollection {
  groups: WhitelistGroup[];
}

export type NewWhitelistGroup = Omit<WhitelistGroup, "id" | "users">;
export type UpdateWhitelistGroup = Omit<WhitelistGroup, "users">;

// 부분 업데이트용 타입들
export type PartialWhitelistGroup = Partial<WhitelistGroup>;
export type PartialWhitelistUser = Partial<WhitelistUser>;

//---
// 권한 요청 사용자 - ROLE_PERMISSION_REQUESTED 상태의 유저들
export interface PermissionRequestUser {
  id: number;
  email: string;
  name: string;
  employeeId: string;
  team: string;
}

// 권한 요청 목록 컬렉션
export interface PermissionRequests {
  requests: PermissionRequestUser[];
}
