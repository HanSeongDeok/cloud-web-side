export const API_CONFIG = {
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  } as const;
  

/**
 * 개별 API EndPoint
 */
export const DATA_TABLE = {
  columns: '/api/data-table/columns',
  data: '/api/data-table/all-data',
  search: '/api/data-table/search',
} as const;


/**
 * 전체 API EndPoint 모음 객체
 */
export const API_ENDPOINTS = {
    dataTable: {
      columns: '/data-table/columns',
      data: '/data-table/all-data',
    },
  } as const; 


