export type ActionType =
  | "LOGIN"
  | "LOGOUT"
  | "FILE_UPLOAD"
  | "FILE_DOWNLOAD"
  | "FILE_EDIT"
  | "FILE_MOVE"
  | "FILE_DELETE"
  | "FILE_DELETE_PERMANENT"
  | "FILE_RESTORE"
  | "GROUP_UPLOAD"
  | "GROUP_DOWNLOAD"
  | "GROUP_EDIT"
  | "GROUP_DELETE"
  | "GROUP_DELETE_PERMANENT"
  | "PERMISSION_REQUEST"
  | "APPROVE_REQUEST"
  | "PROP_ADD"
  | "PROP_REMOVE"
  | "PROP_EDIT"
  | "LUT_ADD"
  | "LUT_REMOVE"
  | "LUT_EDIT"
  | "WHITELIST_ACCEPT"
  | "WHITELIST_REJECT"
  | "WHITELIST_TEAM_DELETE"
  | "WHITELIST_USER_DELETE"
  | "ADMIN_GRANT"
  | "ADMIN_REVOKE";

export interface Log {
  time: string; // ISO 8601 형식의 날짜 문자열
  action: ActionType;
  userId: string;
  userName: string;
  ip: string;
  message: string;
}

export interface LogsResponse {
  logs: Log[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LogRequest {
  page: string;
  size: string;
  action?: ActionType[];
  start?: string; // ISO 8601 형식의 날짜 문자열
  end?: string; // ISO 8601 형식의 날짜 문자열
  searchTerm?: string;
}
