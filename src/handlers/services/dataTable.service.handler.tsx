import type { Column } from '@/handlers/events/dataTable.config.handler';
import { API_CONFIG, DATA_TABLE } from '@/api/api.config.ts';

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
export const fetchData = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DATA_TABLE.data}`);
    
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