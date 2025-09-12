import { API_CONFIG, API_CONFIG_DEV, PERMISSION, SSO_LOGIN } from '@/config/api.config';

/**
 * 테스트용 SSO 로그인
 * @returns 
 */
export const ssoLoginPage = async () => {
    window.location.href  = `${API_CONFIG.baseURL}${SSO_LOGIN.ssoLogin}`;
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
