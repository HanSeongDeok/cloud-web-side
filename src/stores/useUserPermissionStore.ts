import { create } from 'zustand';

export interface PermissionData {
    isRequesting: boolean;
    hasPermission: boolean;
    name?: string;
    email?: string;
    role?: string;
    id?: number;
}

interface UserPermissionState {
    permissionData: PermissionData;
    setPermissionData: (permissionData: PermissionData) => void;
}

export const useUserPermissionStore = create<UserPermissionState>((set) => ({
    permissionData: {isRequesting: false, hasPermission: false},
    setPermissionData: (permissionData: PermissionData) => set({ permissionData }),
}));
