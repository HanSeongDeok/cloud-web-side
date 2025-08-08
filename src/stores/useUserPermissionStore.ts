import { create } from 'zustand';

export interface PermissionData {
    isRequesting: boolean;
    hasPermission?: boolean;
    role?: string;
    name?: string;
    picture?: string;
    email?: string;
}

interface UserPermissionState {
    permissionData: PermissionData;
    setPermissionData: (permissionData: PermissionData) => void;
}

export const useUserPermissionStore = create<UserPermissionState>((set) => ({
    permissionData: {isRequesting: false},
    setPermissionData: (permissionData: PermissionData) => set({ permissionData }),
}));
