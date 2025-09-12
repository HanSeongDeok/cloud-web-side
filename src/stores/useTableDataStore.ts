import { create } from "zustand";
import { searchInfoData } from "@/handlers/services/dataTable.service.handler";

export interface PaginationInfo {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalRow: number;
}

export interface SearchInfoBody {
    mode: string;
    paging: {
        page: number;
        size: number;
    };
    q?: string;
    searchTarget?: string;
    [key: string]: any;
}

interface DataTableStore {
    // 데이터 관련
    data: any[];
    pagination: PaginationInfo;
       
    setData: (data: any[]) => void;
    setPagination: (pagination: PaginationInfo) => void;

    // 데이터 페칭 관련
    fetchSearchData: (searchInfo: SearchInfoBody) => Promise<void>;
}

export const useDataTableStore = create<DataTableStore>((set, get) => ({
    // 데이터 관련
    data: [],
    setData: (data) => set({ data }),
    
    // 페이지네이션 관련
    pagination: {
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        totalRow: 0,
    },
    setPagination: (pagination: PaginationInfo) => set({ pagination }),  
    fetchSearchData: async (searchInfo: SearchInfoBody) => {
        try {
            const data = await searchInfoData(searchInfo);
            let updateData: any[] = [];
            
            if (Array.isArray(data.data.items)) {
                updateData = transformDataItems(data.data.items);
            }

            get().setData(updateData);
            get().setPagination({
                pageSize: data.data.size,
                currentPage: data.data.page + 1,
                totalPages: data.data.totalPages,
                totalRow: data.data.totalItems,
            });
            console.log(get().data);
        } catch (error) {
            console.error('Failed to fetch search data:', error);
        }
    }
}));

/**
 * 데이터 변환
 * @param items 
 * @returns 
 */
const transformDataItems = (items: any[]) => {
    let updateData: any[] = [];
    let updateChildren: any[] = [];
    
    updateData = items.map((item: any) => {
        if (typeof item.type !== "undefined") {
            item.fileformat = item.type;
            delete item.type;
            processGroupChildren(item, updateChildren);
        }
        transformBasicFields(item);
        return item;
    });
    
    if (updateChildren.length > 0) {
        updateData = updateData.concat(updateChildren);
    }
    
    return updateData;
};

/**
 * 기본 컬럼에 대한 처리
 * @param item 
 */
const transformBasicFields = (item: any) => {
    if (typeof item.id !== "undefined") {
        item.registrationNumber = item.id;
        item.path = [item.id];
        delete item.id;
    }
    if (typeof item.type !== "undefined") {
        item.fileFormat = item.type;
        delete item.type;
    }
    if (typeof item.customMetadata !== "undefined") {
        const newCustomMetadata: Record<string, any> = {};
        Object.entries(item.customMetadata).forEach(([key, customvalue]) => {
            newCustomMetadata[key] = customvalue;
            item[key] = customvalue;
        });
    }
};

/**
 * 동적 컬럼에 대한 처리
 * @param item 
 * @param updateChildren 
 */
const processGroupChildren = (item: any, updateChildren: any[]) => {
    if (item.id && item.fileformat === "GROUP" && item.children && Array.isArray(item.children) && item.children.length > 0) {
        Object.entries(item.children).forEach(([, value]: [string, any]) => {
            if (typeof value.id !== "undefined") {
                value.registrationNumber = value.id;
                value.path = [item.id, value.id];
                delete value.id;
            }
            if (typeof value.type !== "undefined") {
                value.fileFormat = value.type;
                delete value.type;
            }
            if (typeof value.customMetadata !== "undefined") {
                const newCustomMetadata: Record<string, any> = {};
                Object.entries(value.customMetadata).forEach(([key, customvalue]) => {
                    newCustomMetadata[key] = customvalue;
                    value[key] = customvalue;
                });
            }
            updateChildren.push(value);
        });
    }
};