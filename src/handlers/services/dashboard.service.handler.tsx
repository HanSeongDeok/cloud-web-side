// 백엔드 연결 시 사용할 import (현재 주석처리)
import { API_CONFIG, DASHBOARD } from "@/config/api.config";
import type { ChartSpec, ChartData, FieldMeta } from "@/types/dashboard";
import { convertChartSpecToRequest } from "@/types/chartRequest";
import { ChartDataTransformer } from "../events/chartData.transformer.handler";
import { useDash } from "@/stores/useDash";
import type { SearchInfoBody } from "@/stores/useTableDataStore";

/**
 * 차트 데이터를 가져와서 변환한 후 store에 저장하는 함수
 * @param widgetId - 위젯 ID
 * @param chartSpec - 차트 스펙
 * @returns Promise<ChartData> - 변환된 차트 데이터
 */
export const fetchChartData = async (
  globalFilters: Omit<SearchInfoBody, "paging">,
  widgetId: string,
  chartSpec: ChartSpec
): Promise<ChartData> => {
  try {
    const request = convertChartSpecToRequest(globalFilters, chartSpec);
    console.log("차트 요청 파라미터:", { widgetId, request });

    const response = await fetch(`${API_CONFIG.baseURL}${DASHBOARD.data}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();

    // 백엔드 연결 시 사용할 코드 (현재 주석처리)
    // if (!result.success) {
    //   // 실패 응답 구조: { success: false, status: number, code: string, message: string }
    //   const errorMessage =
    //     result.message || "대시보드 조회 중 오류가 발생했습니다";
    //   const errorCode = result.code ? `[${result.code}] ` : "";
    //   const statusInfo = result.status ? ` (Status: ${result.status})` : "";

    //   throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    // }

    // API 응답을 AG Charts용 데이터로 변환
    const transformedData = ChartDataTransformer.transformToChartData(
      result,
      chartSpec
    );

    // store에 변환된 데이터 저장
    useDash.getState().updateWidget(widgetId, { data: transformedData });

    console.log("차트 데이터 변환 및 저장 완료:", {
      widgetId,
      transformedData,
    });
    return transformedData;
  } catch (error) {
    console.error("차트 요청 에러 :", error);
    throw error;
  }
};
/**
 *
 * @returns
 */
export const fetchChartFields = async (): Promise<FieldMeta[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DASHBOARD.field}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("차트 필드 에러 :", error);
    throw error;
  }
};
