export const API_CONFIG = {
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  } as const;
  
export const DataTable = {
  columns: '/api/data-table/columns',
  data: '/api/data-table/all-data',
} as const;

export const File = {
  upload: '/file/upload',
  download: '/file/download',
} as const;

export const API_ENDPOINTS = {
    dataTable: {
      columns: '/data-table/columns',
      data: '/data-table/all-data',
    },
    file: {
      upload: '/file/upload',
      download: '/file/download',
    },
  } as const; 


