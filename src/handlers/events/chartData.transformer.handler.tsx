import type { ChartResponse } from "@/types/chartResponse";
import type {
  ChartData,
  ChartSpec,
  SeriesConfig,
  ChartDataItem,
} from "@/types/dashboard";

export class ChartDataTransformer {
  /**
   * API 응답을 AG Charts용 데이터로 변환
   */
  static transformToChartData(
    response: ChartResponse,
    chartSpec: ChartSpec
  ): ChartData {
    const { dataNoDim, dataOneDim, dataTwoDim, shape } = response;

    // shape에 따른 분기 처리
    switch (shape) {
      case "NO_DIMENSION":
        return this.transformNoDimension(dataNoDim!, chartSpec);

      case "ONE_DIMENSION":
        return this.transformOneDimension(dataOneDim!, chartSpec);

      case "TWO_DIMENSION":
        return this.transformTwoDimension(dataTwoDim!, chartSpec);

      default:
        throw new Error(`Unknown data shape: ${shape}`);
    }
  }

  /**
   * NO_DIMENSION 데이터 변환 (단일 값) x 나 series 가 없는 Case
   */
  private static transformNoDimension(
    dataNoDim: { value: number },
    chartSpec: ChartSpec
  ): ChartData {
    const data: ChartDataItem[] = [
      {
        x: "All",
        value: dataNoDim.value,
      },
    ];
    //line, area, pie 는 무조건 하나의 dimension이 필요함 따라서 bar로 고정
    const series: SeriesConfig[] = [
      {
        type: "bar",
        xKey: "x",
        yKey: "value",
        yName: `${chartSpec.yKey} (${chartSpec.agg})`,
      },
    ];

    return { data, series };
  }

  /**
   * ONE_DIMENSION 데이터 변환 x or series 만 있는 Case (optional y)
   */
  private static transformOneDimension(
    dataOneDim: {
      dimensionField: string;
      rows: { label: string; value: number }[];
    },
    chartSpec: ChartSpec
  ): ChartData {
    const { xKey, seriesKey } = chartSpec;

    if (seriesKey && !xKey) {
      // seriesKey only: 시리즈별 데이터 처리
      return this.transformSeriesOnly(dataOneDim, chartSpec);
    } else {
      // xKey only: X축 기반 데이터 처리
      return this.transformXAxisOnly(dataOneDim, chartSpec);
    }
  }

  /**
   * seriesKey만 있는 경우 처리
   */
  private static transformSeriesOnly(
    dataOneDim: {
      dimensionField: string;
      rows: { label: string; value: number }[];
    },
    chartSpec: ChartSpec
  ): ChartData {
    if (chartSpec.chartType === "PIE") {
      // PIE 차트는 기존 rows 구조를 유지하되 label 키만 dimensionField로 변경
      const data: ChartDataItem[] = dataOneDim.rows.map((row) => ({
        [dataOneDim.dimensionField]: row.label,
        value: row.value,
      }));

      const series: SeriesConfig[] = [
        {
          type: "pie",
          angleKey: "value",
          calloutLabelKey: dataOneDim.dimensionField,
          legendItemKey: dataOneDim.dimensionField,
        },
      ];
      return { data, series };
    }
    const data: ChartDataItem[] = [
      {
        x: "All", // 모든 시리즈가 하나의 X축 값을 공유
        ...dataOneDim.rows.reduce((acc, row) => {
          acc[row.label] = row.value;
          return acc;
        }, {} as Record<string, number>),
      },
    ];
    const series: SeriesConfig[] = dataOneDim.rows.map((row) => ({
      type:
        chartSpec.chartType === "BAR"
          ? "bar"
          : chartSpec.chartType === "LINE"
          ? "line"
          : chartSpec.chartType === "AREA"
          ? "area"
          : "bar",
      xKey: dataOneDim.dimensionField,
      yKey: row.label,
      yName: row.label,
    })) as SeriesConfig[];

    return { data, series };
  }

  /**
   * xKey만 있는 경우 처리
   */
  private static transformXAxisOnly(
    dataOneDim: {
      dimensionField: string;
      rows: { label: string; value: number }[];
    },
    chartSpec: ChartSpec
  ): ChartData {
    const { yKey, agg } = chartSpec;

    const data: ChartDataItem[] = dataOneDim.rows.map((row) => ({
      [dataOneDim.dimensionField]: row.label,
      ["value"]: row.value,
    }));

    const series: SeriesConfig[] = [
      {
        type:
          chartSpec.chartType === "LINE"
            ? "line"
            : chartSpec.chartType === "AREA"
            ? "area"
            : "line",
        xKey: dataOneDim.dimensionField,
        yKey: "value",
        yName: `${yKey} (${agg})`,
      } as SeriesConfig,
    ];

    return { data, series };
  }

  /**
   * TWO_DIMENSION 데이터 변환
   */
  private static transformTwoDimension(
    dataTwoDim: {
      groupField: string;
      seriesField: string;
      rows: {
        group: string;
        series: { label: string; value: number }[];
      }[];
    },
    chartSpec: ChartSpec
  ): ChartData {
    // 모든 고유한 시리즈 라벨 수집
    const allSeriesLabels = new Set<string>();
    dataTwoDim.rows.forEach((row) => {
      row.series.forEach((s) => allSeriesLabels.add(s.label));
    });

    // 데이터 변환 혹시 차후 xKey 값 모두 x로 통일하려면 dataTwoDim.groupField -> x 로 바꾸기
    const data: ChartDataItem[] = dataTwoDim.rows.map((row) => {
      const item: ChartDataItem = {
        [dataTwoDim.groupField]: row.group,
      };

      // 각 시리즈 값을 item에 추가
      row.series.forEach((s) => {
        item[s.label] = s.value;
      });

      // 빠진 시리즈는 0으로 채움
      Array.from(allSeriesLabels).forEach((label) => {
        if (!(label in item)) {
          item[label] = 0;
        }
      });

      return item;
    });

    // 시리즈 설정 생성
    const series: SeriesConfig[] = Array.from(allSeriesLabels).map((label) => ({
      type:
        chartSpec.chartType === "BAR"
          ? "bar"
          : chartSpec.chartType === "LINE"
          ? "line"
          : chartSpec.chartType === "AREA"
          ? "area"
          : "bar",
      xKey: dataTwoDim.groupField,
      yKey: label,
      yName: label,
    })) as SeriesConfig[];

    return { data, series };
  }

  /**
   * 에러 응답 처리
   */
  static handleErrorResponse(error: unknown): {
    message: string;
    code?: string;
  } {
    // Axios 에러 체크
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; code?: string } };
      };
      if (axiosError.response?.data?.message) {
        return {
          message: axiosError.response.data.message,
          code: axiosError.response.data.code,
        };
      }
    }

    // 일반 Error 객체 체크
    if (error instanceof Error && error.message) {
      return { message: error.message };
    }

    return { message: "알 수 없는 오류가 발생했습니다." };
  }
}

// 함수형 스타일로도 export
export const chartDataTransformer = {
  toChartData: ChartDataTransformer.transformToChartData,
  handleError: ChartDataTransformer.handleErrorResponse,
};
