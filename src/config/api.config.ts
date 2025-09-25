export const API_CONFIG = {
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
} as const;

export const API_CONFIG_DEV = {
  baseURL: "http://localhost:8081",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
} as const;

/**
 * 파일 프로퍼티 API EndPoint
 */
export const DATA_TABLE = {
  data: "/api/v1/files",
  columns: "/api/v1/files/properties",
  lutRules: "/api/v1/files/property-exposure-rules",
} as const;

export const TRASH_CAN_DATA_TABLE = {
  data: "/api/v1/files/trash",
  restore: "/api/v1/files/trash/restore",
  delete: "/api/v1/files/trash/purge",
} as const;

export const UPLOAD = {
  init: "/api/v1/files/upload/init",
  complete: "/api/v1/files/upload/complete",
  edit: "/api/v1/files/upload/metadata",
  groupEdit: "/api/v1/files/upload/add-to-group/init",
  groupComplete: "/api/v1/files/upload/add-to-group/complete",
} as const;

export const DOWNLOAD = {
  download: "/api/v1/files/download",
} as const;

export const PERMISSION_DEV = {
  permission: "/api/auth/permission/V2",
  requestPermission: "/api/auth/permission/request/V2",
} as const;

export const SSO_LOGIN = {
  ssoLogin: "/oauth2/authorization/google",
} as const;

/**
 * HMG SSO 관련 API EndPoint
 */
export const HMG_SSO = {
  healthcheck: "/api/v1/sso/healthcheck",
  authorize: "/api/v1/sso/authorize",
  callback: "/api/v1/sso/callback",
  logout: "/api/v1/sso/logout",
  status: "/api/v1/sso/status",
  me: "/api/v1/sso/me",
} as const;

export const PERMISSION = {
  permission: "/api/auth/me",
  requestPermission: "/api/users/permission-request",
} as const;

export const DB_PROPERTY = {
  columns: "/api/v1/admin/db/file-properties/columns",
  list: "/api/v1/admin/db/file-properties",
  create: "/api/v1/admin/db/file-properties",
  update: (propertyId: number) =>
    `/api/v1/admin/db/file-properties/${propertyId}`,
  delete: "/api/v1/admin/db/file-properties",
} as const;

export const LUT_ITEM = {
  list: (propertyId: number) =>
    `/api/v1/admin/db/file-properties/${propertyId}/lut`,
  create: (propertyId: number) =>
    `/api/v1/admin/db/file-properties/${propertyId}/lut`,
  update: (propertyId: number, lutItemId: number) =>
    `/api/v1/admin/db/file-properties/${propertyId}/${lutItemId}`,
  sort: (propertyId: number) =>
    `/api/v1/admin/db/file-properties/${propertyId}/lut`,
  delete: (lutItemId: number) =>
    `/api/v1/admin/db/file-properties/lut/${lutItemId}`,
} as const;

export const WHITELIST = {
  list: `/api/v1/admin/whitelist/team`,
  createGroup: `/api/v1/admin/whitelist/groups`,
  updateGroup: (groupId: number) => `/api/v1/admin/whitelist/groups/${groupId}`,
  deleteGroup: (groupId: number) => `/api/v1/admin/whitelist/groups/${groupId}`,
  deleteUser: (userId: number) => `/api/v1/admin/whitelist/users/${userId}`,
  promoteAdmin: `/api/v1/super-admin/whitelist/roles/users/promote`,
  demoteAdmin: `/api/v1/super-admin/whitelist/roles/users/demote`,
  permissionRequests: `/api/v1/admin/whitelist/permission-requests`,
  approveRequests: `/api/v1/admin/whitelist/permission-requests/approve`,
  rejectRequests: `/api/v1/admin/whitelist/permission-requests/reject`,
} as const;

export const DASHBOARD = {
  field: `/api/v1/dashboard/fields`,
  data: `/api/v1/dashboard`,
  config: `/api/v1/dashboard/config`,
};

export const LOG = {
  list: `/api/v1/admin/logs`,
  data: (id: number) => `/api/v1/admin/logs/${id}`,
  search: `/api/v1/admin/logs/search`,
  filter: `/api/v1/admin/logs/filter`,
  timeRange: `/api/v1/admin/logs/timestamp`,
  opensearch: `/api/v1/admin/logs/opensearch`,
} as const;

/**
 * 전체 API EndPoint 모음 객체
 */
export const API_ENDPOINTS = {
  dataTable: {
    columns: "/data-table/columns",
    data: "/data-table/all-data-v3",
  },
} as const;

/**
 * myPage용 User Info API
 */
export const MY_PAGE = {
  data: "/api/v1/me",
} as const;
