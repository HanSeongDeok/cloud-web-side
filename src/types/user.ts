// src/types/user.ts
export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
  PERMISSION_REQUIRED: "PERMISSION_REQUIRED",
  PERMISSION_REQUESTED: "PERMISSION_REQUESTED",
}

export interface UserGroup {
  id: number;
  name: string;
  code: string;
  whitelisted: boolean;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: typeof Role;
  employeeId: string;
  userGroup: UserGroup;
  lastLoginAt: string;
}
