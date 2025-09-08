import { create } from "zustand";
import { fetchData, filterSearch } from "@/handlers/services/dataTable.service.handler";

export interface PaginationInfo {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalRow: number;
}

export interface FilterSearchBody {
    mode: string;
    paging: {
      page: number;
      size: number;
    };
    quickFilter: Record<string, string[]>; 
}

interface DataTableStore {
    // 데이터 관련
    data: any[];
    pagination: PaginationInfo;
       
    setData: (data: any[]) => void;
    setPagination: (pagination: PaginationInfo) => void;

    // 데이터 페칭 관련
    fetchPageData: (paginationInfo: PaginationInfo) => Promise<void>;
    fetchFilteredData: (filterInfo: FilterSearchBody) => Promise<void>;   
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
  
    // 데이터 페칭 관련
    fetchPageData: async (paginationInfo: PaginationInfo) => {
        try {
            const data = await fetchData(paginationInfo);
            let updateData: any[] = [];
            let updateChildren: any[] = [];
            if (Array.isArray(data.data.items)) {
                updateData = data.data.items.map((item: any) => {
                    if (typeof item.type !== "undefined") {
                        item.fileformat = item.type;
                        delete item.type;
                        if (item.id && item.fileformat === "GROUP" && item.children.length > 0) {
                            Object.entries(item.children).forEach(([key, value]: [string, any]) => {
                                if (typeof value.id !== "undefined") {
                                    value.registrationnumber = value.id;
                                    value.path = [item.id, value.id];
                                    delete value.id;
                                }

                                if (typeof value.type !== "undefined") {
                                    value.fileformat = value.type;
                                    delete value.type;
                                }
                                if (typeof value.uploadedAt !== "undefined") {
                                    value.uploadedat = value.uploadedAt;
                                    delete value.uploadedAt;
                                }
                                if (typeof value.testResult !== "undefined") {
                                    value.result = value.testResult;
                                    delete value.testResult;
                                }
                                if (typeof value.customMetadata !== "undefined") {
                                    const newCustomMetadata: Record<string, any> = {};
                                    Object.entries(value.customMetadata).forEach(([key, customvalue]) => {
                                        const newKey = key.toLowerCase().replace(/\s+/g, "");
                                        newCustomMetadata[newKey] = customvalue;
                                        value[newKey] = customvalue;
                                    });
                                }
                                updateChildren.push(value);
                            });
                        }
                    }

                    if (typeof item.id !== "undefined") {
                        item.registrationnumber = item.id;
                        item.path = [item.id];
                        delete item.id;
                    }
                    if (typeof item.uploadedAt !== "undefined") {
                        item.uploadedat = item.uploadedAt;
                        delete item.uploadedAt;
                    }
                    if (typeof item.testResult !== "undefined") {
                        item.result = item.testResult;
                        delete item.testResult;
                    }
                    if (typeof item.customMetadata !== "undefined") {
                        // customMetadata의 key를 소문자 및 공백 제거한 형태로 교체
                        const newCustomMetadata: Record<string, any> = {};
                        Object.entries(item.customMetadata).forEach(([key, customvalue]) => {
                            const newKey = key.toLowerCase().replace(/\s+/g, "");
                            newCustomMetadata[newKey] = customvalue;
                            item[newKey] = customvalue;
                        });
                    }
                    return item;
                });
            }
            if (updateChildren.length > 0) {
                updateData = updateData.concat(updateChildren);
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
            console.error('Failed to fetch page data:', error);
        }
    },
    
    fetchFilteredData: async (filterInfo: FilterSearchBody) => {
        try {
            const data = await filterSearch(filterInfo);
            let updateData: any[] = [];
            let updateChildren: any[] = [];
            if (Array.isArray(data.data.items)) {
                updateData = data.data.items.map((item: any) => {
                    if (typeof item.type !== "undefined") {
                        item.fileformat = item.type;
                        delete item.type;
                        if (item.id && item.fileformat === "GROUP" && item.children.length > 0) {
                            Object.entries(item.children).forEach(([key, value]: [string, any]) => {
                                if (typeof value.id !== "undefined") {
                                    value.registrationnumber = value.id;
                                    value.path = [item.id, value.id];
                                    delete value.id;
                                }
                                if (typeof value.type !== "undefined") {
                                    value.fileformat = value.type;
                                    delete value.type;
                                }
                                if (typeof value.uploadedAt !== "undefined") {
                                    value.uploadedat = value.uploadedAt;
                                    delete value.uploadedAt;
                                }
                                if (typeof value.testResult !== "undefined") {
                                    value.result = value.testResult;
                                    delete value.testResult;
                                }
                                if (typeof value.customMetadata !== "undefined") {
                                    const newCustomMetadata: Record<string, any> = {};
                                    Object.entries(value.customMetadata).forEach(([key, customvalue]) => {
                                        const newKey = key.toLowerCase().replace(/\s+/g, "");
                                        newCustomMetadata[newKey] = customvalue;
                                        value[newKey] = customvalue;
                                    });
                                }
                                updateChildren.push(value);
                            });
                        }
                    }
                    if (typeof item.id !== "undefined") {
                        item.registrationnumber = item.id;
                        item.path = [item.id];
                        delete item.id;
                    }
                    if (typeof item.uploadedAt !== "undefined") {
                        item.uploadedat = item.uploadedAt;
                        delete item.uploadedAt;
                    }
                    if (typeof item.testResult !== "undefined") {
                        item.result = item.testResult;
                        delete item.testResult;
                    }
                    if (typeof item.customMetadata !== "undefined") {
                        const newCustomMetadata: Record<string, any> = {};
                        Object.entries(item.customMetadata).forEach(([key, customvalue]) => {
                            const newKey = key.toLowerCase().replace(/\s+/g, "");
                            newCustomMetadata[newKey] = customvalue;
                            item[newKey] = customvalue;
                        });
                    }
                    return item;
                });
            }
            if (updateChildren.length > 0) {
                updateData = updateData.concat(updateChildren);
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
            console.error('Failed to fetch filtered data:', error);
        }
    }
}));
