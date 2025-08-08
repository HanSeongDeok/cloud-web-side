/**
 * TODO 추후 토큰 담기
 */
export const API_CONFIG = {
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  } as const;

/**
 * TODO 추후 토큰 담기
 */
export const API_CONFIG_DEV = {
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * 개별 API EndPoint 저장소 테이블
 */
export const DATA_TABLE = {
  columns: '/api/data-table/columns',
  data: '/api/data-table/all-data-v3',
  dataTotalCount: '/api/data-table/total-count',
  search: '/api/data-table/search',
} as const;

/**
 * 개별 API EndPoint SSO 로그인
 */
export const SSO_LOGIN = {
  ssoLogin: '/api/auth/google',
} as const;

export const PERMISSION = {
  permission: '/api/auth/permission/V2',
  requestPermission: '/api/auth/permission/request/V2',
} as const;


export const SSO_LOGIN_DEV = {
  ssoLogin: '/oauth2/authorization/google',
} as const;

export const PERMISSION_DEV = {
  permission: '/api/auth/status',
  requestPermission: '/api/users/permission-request',
} as const;

/**
 * 전체 API EndPoint 모음 객체
 */
export const API_ENDPOINTS = {
    dataTable: {
      columns: '/data-table/columns',
      data: '/data-table/all-data-v3',
    },
  } as const; 


