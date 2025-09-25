export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: boolean;
  status: number;
  code: string; // 예: AUTH_001, SSO_001 등
  message: string; // 사용자용 메시지
  path: string;
  traceId?: string; // Optional field
  debugMessage?: string; // Optional field
}