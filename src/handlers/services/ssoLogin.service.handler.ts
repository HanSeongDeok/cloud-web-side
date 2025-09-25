import { API_CONFIG, HMG_SSO, PERMISSION, SSO_LOGIN } from '@/config/api.config';
import type { HmgSsoHealthcheckRequest } from '@/types/login';

/**
 * 테스트용 SSO 로그인
 * @returns 
 */
export const ssoLoginPage = async () => {
    window.location.href  = `${API_CONFIG.baseURL}${SSO_LOGIN.ssoLogin}`;
  }
/**
 * HMG SSO 헬스체크 요청
 */
export const ssoHealthcheck = async (request: HmgSsoHealthcheckRequest) => {
  const response = await fetch(`${API_CONFIG.baseURL}/api/v1/sso/healthcheck`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });
  return response;
};

/**
 * HMG SSO 인증 URL로 리다이렉트
 */
export const ssoAuthorize = (state: string, nonce?: string) => {
  const params = new URLSearchParams({
    state,
    ...(nonce && { nonce }),
  });
  
  window.location.href = `${API_CONFIG.baseURL}${HMG_SSO.authorize}?${params.toString()}`;
};

/**
 * 현재 사용자 정보 조회 (SSO 로그인 후)
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${HMG_SSO.me}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response;
};

/**
 * SSO 로그아웃
 */
export const ssoLogout = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${HMG_SSO.logout}`, {
    method: 'POST',
    credentials: 'include',
  });
  return response;
};

/**
 * 권한 확인
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
