import type { Column } from '@/handlers/events/dataTable.config.handler';
import { API_CONFIG, DATA_TABLE, FILE_PROPERTY } from '@/api/api.config.ts';
import type { PaginationInfo } from '@/stores/usePaginationState ';

/**
 * 
 * @returns 
 */
export const fetchDataTotalCount = async () => {
  // const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.dataTotalCount}`);
  const response = JSON.stringify({ totalCount: 10 });
  return response;
}

/**
 * 
 * @returns 
 */
export const fetchColumns = async (): Promise<Column> => {
  // try {
  //   const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.columns}`);
  //   // const response = await fetch(`${API_CONFIG.baseURL}${FILE_PROPERTY.columns}`);

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   return await response.json();
  // } catch (error) {
  //   throw error;
  // }

  const response2 = await fetch(`${API_CONFIG.baseURL}${FILE_PROPERTY.properties}`);
  const data2 = await response2.json();
  console.log(data2.data);

  return   data2.data;
;
};

/**
 * 
 * @returns 
 */
export const fetchData = async (paginationInfo: PaginationInfo): Promise<any[]> => {
  // try {
  //   const url = new URL(`${API_CONFIG.baseURL}${DATA_TABLE.data}`);
  //   url.searchParams.set("limit", paginationInfo.pageSize.toString());
  //   url.searchParams.set("offset", ((paginationInfo.currentPage-1) * paginationInfo.pageSize).toString());

  //   const response = await fetch(url.toString());

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   return await response.json();
  // } catch (error) {
  //   throw error;
  // }

  const filesResponse = await fetch(`${API_CONFIG.baseURL}${FILE_PROPERTY.files}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    // GET 요청에서 body를 보내는 것은 표준이 아님 -> 프레임 워크에서 자동 막음, 
    body: JSON.stringify({
      mode: 'NONE',
      paging: {
        page: paginationInfo.currentPage,
        size: paginationInfo.pageSize
      }
    })
  });

  const filesData = await filesResponse.json();
  console.log(filesData.data.items); 

  return filesData.data.items;
};    

/**
 * 
 * @param keyword 
 * @returns 
 */
export const searchData = async (keyword: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.search}?keyword=${encodeURIComponent(keyword)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};