import { API_CONFIG, DATA_TABLE } from '@/config/api.config';
import type { ColumnArray } from '@/stores/useColumnsStore';
import type { FilterSearchBody } from '@/stores/useTableDataStore';
  import type { PaginationInfo } from '@/stores/useTableDataStore';


/**
 * 
 * @returns 
 */
export const fetchColumns = async (): Promise<ColumnArray[]> => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.columns}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  console.log(data.data);

  return data.data;
};

/**
 * 
 * @returns 
 */
export const fetchData = async (paginationInfo: PaginationInfo | null): Promise<any> => {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    // GET 요청에서 body를 보내는 것은 표준이 아님 -> 프레임 워크에서 자동 막음, 
    body: JSON.stringify({
      mode: 'NONE',
      paging: {
        page: paginationInfo?.currentPage ? paginationInfo.currentPage - 1 : 0,
        size: paginationInfo?.pageSize
      },
    })
  }); 

  const data = await response.json(); 
  return data;
};    

/**
 * 
 * @param filterInfo - 필터 정보
 * @returns 
 */
export const filterSearch = async (filterInfo: FilterSearchBody): Promise<any> => {
  try {
  const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(filterInfo),
  });

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error('Filter search failed:', error);
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