import type { Column } from '@/handlers/dataTable.config.handler';
import { API_CONFIG, API_ENDPOINTS, DataTable } from '@/api/api.config.ts';

export const fetchColumns = async (): Promise<Column> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DataTable.columns}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchData = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DataTable.data}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}; 