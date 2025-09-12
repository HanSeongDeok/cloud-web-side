// 백엔드 연결 시 사용할 import (현재 주석처리)
// import { API_CONFIG, DASHBOARD } from "@/api/api.config.ts";
import type { ChartSpec, ChartData } from "@/types/dashboard";
import { convertChartSpecToRequest } from "@/types/chartRequest";

/**
 * 차트 데이터를 가져와서 변환한 후 store에 저장하는 함수
 * @param widgetId - 위젯 ID
 * @param chartSpec - 차트 스펙
 * @returns Promise<ChartData> - 변환된 차트 데이터
 */
export const fetchChartData = async (
  widgetId: string,
  chartSpec: ChartSpec
): Promise<ChartData> => {
  try {
    const request = convertChartSpecToRequest(chartSpec);
    console.log("차트 요청 파라미터:", { widgetId, request });

    // 임시: 로컬 더미 데이터 사용 (나중에 백엔드 연결 시 아래 주석 해제)
    const response = await fetch("/data/dashboard_dummy_10k.json");

    // 백엔드 연결 시 사용할 코드 (현재 주석처리)
    // const response = await fetch(`${API_CONFIG.baseURL}${DASHBOARD.data}`,{
    // method: "POST",
    // headers: {
    // "Content-Type": "application/json",
    // },
    // credentials: "include",
    // body: JSON.stringify(request),
    // });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();
    return result;
    // const apiResponse: ChartResponse = await response.json();

    // // API 응답을 AG Charts용 데이터로 변환
    // const transformedData = ChartDataTransformer.transformToChartData(
    //   apiResponse,
    //   chartSpec
    // );

    // // store에 변환된 데이터 저장
    // useDash.getState().updateWidget(widgetId, { data: transformedData });

    // console.log("차트 데이터 변환 및 저장 완료:", {
    //   widgetId,
    //   transformedData,
    // });
    // return transformedData;

    // 백엔드 연결 시 사용할 코드 (현재 주석처리)
    /*
    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "대시보드 조회 중 오류가 발생했습니다";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";

      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("대시보드 조회 성공:", result.message);
    return result.data || [];
    */
  } catch (error) {
    console.error("차트 요청 에러 :", error);
    throw error;
  }
};
