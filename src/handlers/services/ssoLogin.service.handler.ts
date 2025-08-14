import { API_CONFIG, API_CONFIG_DEV, PERMISSION, PERMISSION_DEV, SSO_LOGIN, SSO_LOGIN_DEV } from '@/api/api.config.ts';

/**
 * 테스트용 SSO 로그인
 * @returns 
 */
export const ssoLoginPage = async () => {
    window.location.href  = `${API_CONFIG.baseURL}${SSO_LOGIN.ssoLogin}`;
  }

  /**
   * 환경 SSO 로그인
   */
export const ssoLoginPageDev = async () => {
  window.location.href  = `${API_CONFIG_DEV.baseURL}${SSO_LOGIN_DEV.ssoLogin}`;
}

/**
 * 
 * @returns 
 */
export const permissionPage = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${PERMISSION.permission}`, {
    method: 'GET',
    credentials: "include",
  });
  return response;
}

export const permissionPageDev = async () => {
  const response = await fetch(`${API_CONFIG_DEV.baseURL}${PERMISSION_DEV.permission}`, {
    method: "GET",
    credentials: "include",
  });
  return response;
}

/**
 * 
 * @param email 
 * @returns 
 */
export const requestPermission = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${PERMISSION.requestPermission}`, {
    method: 'POST',
    credentials: 'include',
  });
  return response;
}

export const requestPermissionDev = async () => {
  const response = await fetch(`${API_CONFIG_DEV.baseURL}${PERMISSION_DEV.requestPermission}`, {
    method: 'PUT',
    credentials: 'include',
  });
  return response;
};