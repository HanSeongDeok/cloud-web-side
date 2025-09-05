import type { Column } from '@/handlers/events/dataTable.config.handler';
import { API_CONFIG, DATA_TABLE } from '@/api/api.config.ts';
import type { PaginationInfo } from '@/stores/useTableDataStore';

/**
 * 
 * @returns 
 */
export const fetchDataTotalCount = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`);
  return response;
}

/**
 * 
 * @returns 
 */
export const fetchColumns = async (): Promise<Column> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.columns}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @returns 
 */
export const fetchData = async (paginationInfo: PaginationInfo): Promise<any[]> => {
  try {

    const url = new URL(`${API_CONFIG.baseURL}${DATA_TABLE.data}`);
    url.searchParams.set("limit", paginationInfo.pageSize.toString());
    url.searchParams.set("offset", ((paginationInfo.currentPage-1) * paginationInfo.pageSize).toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param keyword 
 * @returns 
 */
export const searchData = async (keyword: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}?keyword=${encodeURIComponent(keyword)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};