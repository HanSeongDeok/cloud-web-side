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
} as const;

export const UPLOAD = {
  init: "/api/v1/files/upload/init",
  complete: "/api/v1/files/upload/complete",
} as const;

export const SSO_LOGIN = {
  ssoLogin: "/oauth2/authorization/google",
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
  data: `/api/v1/dashboard`,
  config: `/api/v1/dashboard/config`,
};
/**
 * 전체 API EndPoint 모음 객체
 */
export const API_ENDPOINTS = {
  dataTable: {
    columns: "/data-table/columns",
    data: "/data-table/all-data-v3",
  },
} as const;
