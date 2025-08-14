// 사용자 권한 역할 타입
export type UserRole =
  | "ROLE_PERMISSION_REQUIRED" // 권한 필요
  | "ROLE_PERMISSION_REQUESTED" // 권한 요청됨
  | "ROLE_USER" // 일반 사용자
  | "ROLE_ADMIN" // 관리자
  | "ROLE_SUPER_ADMIN"; // 최고 관리자

// 사용자 정보 인터페이스
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

// 새 그룹 생성용 타입 ( 팀 그룹  탭 )
export type NewWhitelistGroup = Omit<WhitelistGroup, "id" | "users">;
// 그룹 업데이트용 타입 (name, code만 수정 가능, users 제외)
export type UpdateWhitelistGroup = Omit<WhitelistGroup, "users">;

// 새 사용자 생성용 타입 ( 권한 요청 탭  )
export type NewWhitelistUser = Omit<WhitelistUser, "id">;

// 부분 업데이트용 타입들
export type PartialWhitelistGroup = Partial<WhitelistGroup>;
export type PartialWhitelistUser = Partial<WhitelistUser>;
