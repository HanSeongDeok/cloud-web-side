import { API_CONFIG, LOG } from "@/config/api.config";
import type { LogRequest, LogsResponse } from "@/types/log";

/**
 * 로그 목록을 최신순으로 가져오는 함수
 * @param LogRequest
 * @returns Promise<LogsResponse> - 로그 데이터 목록
 */
export const getLatestLogs = async (
  logRequest: LogRequest
): Promise<LogsResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${LOG.list}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logRequest),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "로그 데이터 조회 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("로그 데이터 로딩 성공:", result.data);

    return {
      logs: result.data.content,
      total: result.data.totalElements,
      page: result.data.page || 1,
      pageSize: result.data.size || result.data.pageSize || 10,
    };
  } catch (error) {
    console.error("getLogCollection 에러:", error);
    throw error;
  }
};

/**
 * LOG.OPENSEARCH 엔드포인트를 호출하는 서비스 핸들러
 * @param
 * @returns Promise<string> - OpenSearch 대시보드 URL
 */
export const redirectToOpenSearch = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${LOG.opensearch}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `OpenSearch API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();
    if (!result.success) {
      const errorMessage =
        result.message || "OpenSearch 리디렉션 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }
    return result.data;
  } catch (error) {
    console.error("redirectToOpenSearch 에러:", error);
    throw error;
  }
};
