export type HmgSsoCompany = {
  HMC: 'HMC',      // 현대자동차 (기본값)
  HAE: 'HAE',      // 현대오토에버
  KMC: 'KMC',      // 기아자동차
  HKMC: 'HKMC',    // 현대기아차
  ALL: 'ALL'       // 전체
}

  export type HmgSsoLoginType = {
  SSO_LOGIN: 'SSO_LOGIN',      // 간편 로그인
  MANUAL_LOGIN: 'MANUAL_LOGIN' // 일반 로그인
}

export interface HmgSsoHealthcheckRequest {
  company: HmgSsoCompany;
  loginType: HmgSsoLoginType;
}

export interface HmgSsoHealthcheckResponse {
  result: boolean;
  status?: string;
  message: string;
  state?: string; // authorize 요청시 필요
}

export interface HmgSsoAuthorizeRequest {
  state: string;
  nonce?: string;
}

export interface HmgSsoCallbackRequest {
  code?: string;
  error?: string;
  state: string;
}

// URL Query Parameter로 넘어오는 콜백 데이터
export interface SsoCallbackParams {
  status: 'success' | 'fail';
  message: string;
  needsPasswordChange?: string;
}