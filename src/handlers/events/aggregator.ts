/** xKey별로 topK를 구하고 Others로 집계하는 함수 */
function applyPerXTopK(
  rows: Row[],
  xKey: string | undefined,
  seriesKey: string | undefined,
  yKey: string | undefined,
  agg: AggType,
  k?: number
): Row[] {
  if (!seriesKey || !xKey || !k || k <= 0) return rows;
  // xKey별로 그룹화
  const grouped = new Map<string, Row[]>();
  for (const r of rows) {
    const x = String(r[xKey]);
    if (!grouped.has(x)) grouped.set(x, []);
    grouped.get(x)!.push(r);
  }
  // 각 그룹별로 topK 적용
  const result: Row[] = [];
  for (const [, groupRows] of grouped.entries()) {
    // 시리즈별 합계 계산
    const totals = new Map<string, number>();
    for (const r of groupRows) {
      const s = String(r[seriesKey]);
      const v =
        agg === "count" || !yKey
          ? 1
          : typeof r[yKey] === "number"
          ? r[yKey]
          : +r[yKey];
      totals.set(s, (totals.get(s) || 0) + (isFinite(v) ? v : 0));
    }
    // 상위 K 추출
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const topK = sorted.slice(0, k);
    const keepSet = new Set(topK.map(([name]) => name));
    // Others 처리
    for (const r of groupRows) {
      const s = String(r[seriesKey]);
      const s2 = keepSet.has(s) ? s : "Others";
      result.push({ ...r, [seriesKey]: s2 });
    }
  }
  return result;
}
import { useMemo } from "react";

export type ChartType = "bar" | "line" | "area" | "scatter" | "pie" | "donut";

export type AggType = "sum" | "avg" | "max" | "min" | "count";
export type TimeInterval = "year" | "month" | "week" | "date";

export type AggregationSpec = {
  chart: ChartType;
  xKey?: string; // pie/donut은 생략 가능(보통 series를 색상으로 사용)
  yKey?: string; // pie/donut: angle로 사용될 measure
  seriesKey?: string; // 그룹/stack/색상 구분 차원
  agg?: AggType; // 기본 count
  interval?: TimeInterval; // xKey가 날짜일 때
  topK?: number; // 시리즈 폭주 방지(전역 Top-K, 나머지 "Others")
  stacked?: boolean; // 스택드 차트 여부 (bar, area, line에서 사용)
  direction?: string;
  // 날짜 필터링 추가 -  TimeInterval에 따른 range 범위 제한 [일별: 일주일 , 주별: 한달 , 월별 :1년, 년도: 범위 없음]
  dateFilter?: {
    type: "single" | "range";
    startDate?: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
  };
};
//TODO : 일단 고정 차후 동적 컬럼도 반영할 수 있도록 변경 필요
export type Row = {
  id: number;
  FileSize: number;
  FileFormat: string;
  FileCreator: string;
  DeliverableType: string;
  TestType: string;
  Vehicle: string;
  PTtype: string;
  DevStep: string;
  ECU: string;
  TestItem: string;
  TestResult: string;
  MemType: string;
  uploaded_at: string; // (YYYY-MM-DD)
  created_at: string; // (YYYY-MM-DD)
  [key: string]: string | number; // 동적 컬럼 지원을 위해 string | number 타입으로 설정
};

// 대시보드 데이터 배열 타입
export type DashboardData = Row[];

const isValidDate = (v: any) => {
  if (v instanceof Date) return !isNaN(v.getTime());
  const d = new Date(v);
  return !isNaN(d.getTime());
};

function toDate(v: any): Date {
  return v instanceof Date ? v : new Date(v);
}

/** 날짜 필터링 함수 */
// 주어진 날짜 필터와 키를 사용하여 행을 필터링합니다.
function filterByDate(
  rows: Row[],
  dateFilter: AggregationSpec["dateFilter"],
  dateKey: string
): Row[] {
  if (!dateFilter || !dateKey) return rows;

  const { type, startDate, endDate } = dateFilter;

  return rows.filter((row) => {
    const dateValue = row[dateKey];
    // 유효하지 않은 날짜면 제외
    if (!isValidDate(dateValue)) return false;

    const rowDate = toDate(dateValue);
    const rowDateStr = rowDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // 단일 날짜 필터: 정확히 그 날짜만 포함
    if (type === "single" && startDate) {
      return rowDateStr === startDate;
    }

    // 범위 날짜 필터: startDate와 endDate 사이의 날짜만 포함
    if (type === "range" && startDate && endDate) {
      return rowDateStr >= startDate && rowDateStr <= endDate;
    }

    // 위 조건들에 안 걸리면 모든 데이터 포함 (필터링 없음)
    return true;
  });
}

// 날짜 버킷(간격)
function bucketTime(
  d: Date,
  interval: TimeInterval,
  dateFilter?: AggregationSpec["dateFilter"]
): string {
  // 날짜에서 연도, 월, 일 추출
  const y = d.getFullYear();
  const m = d.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
  const day = d.getDate();

  // 연도별 집계: "2024" 형태로 반환
  if (interval === "year") return `${y}`;

  // 월별 집계: "2024-01" 형태로 반환 (월은 2자리로 패딩)
  if (interval === "month") return `${y}-${String(m).padStart(2, "0")}`;

  // 주별 집계: dateFilter 범위를 기준으로 주차 계산
  if (interval === "week") {
    let baseDate: Date;

    // dateFilter가 있고 startDate가 있으면 그것을 기준으로, 없으면 해당 월 1일을 기준으로
    if (dateFilter && dateFilter.startDate) {
      baseDate = new Date(dateFilter.startDate);
    } else {
      baseDate = new Date(d);
      baseDate.setDate(1); // 해당 월의 첫 번째 날로 설정
    }

    // baseDate부터 현재 날짜까지의 일수 차이 계산
    const timeDiff = d.getTime() - baseDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // 주차 계산: 0일차부터 시작하므로 7로 나누고 +1
    const week = Math.floor(daysDiff / 7) + 1;

    return `${y}-W${week}`;
  }

  // 일별 집계: "2024-01-15" 형태로 반환 (월, 일 모두 2자리로 패딩)
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

//숫자 집계
function aggregate(values: number[], agg: AggType): number {
  if (agg === "count") return values.length;
  if (values.length === 0) return 0;
  if (agg === "sum") return values.reduce((a, b) => a + b, 0);
  if (agg === "avg") return values.reduce((a, b) => a + b, 0) / values.length;
  if (agg === "max") return Math.max(...values);
  if (agg === "min") return Math.min(...values);
  return 0;
}

/** 전역 Top-K: seriesKey별 총합 기준 K개만 살리고 나머지는 Series 값은 Others로 변경 */
function applyGlobalTopK(
  rows: Row[],
  xKey: string | undefined,
  seriesKey: string | undefined,
  yKey: string | undefined,
  agg: AggType,
  k?: number
): Row[] {
  if (!seriesKey || !k || k <= 0) return rows;
  // 시리즈별 총합(또는 count) 계산
  const totals = new Map<string, number>();
  for (const r of rows) {
    const s = String(r[seriesKey]); // 예: "PDF", "DOCX"
    const v = //집계할 값
      agg === "count" || !yKey //count 집계 또는 yKey가 없으면 1
        ? 1
        : typeof r[yKey] === "number" // yKey가 숫자일 경우
        ? r[yKey] //그대로 반환
        : +r[yKey]; //문자열은 숫자로 변환
    totals.set(s, (totals.get(s) || 0) + (isFinite(v) ? v : 0));
  }
  // 상위 K 추출
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const topK = sorted.slice(0, k);
  const others = sorted.slice(k); // 이 부분들이 Others가 될 것들

  const keepSet = new Set(topK.map(([name]) => name));

  return rows.map((r) => {
    const s = String(r[seriesKey]);
    const s2 = keepSet.has(s) ? s : "Others";
    return { ...r, [seriesKey]: s2 };
  });
}

//핵심: raw → (x, series)별 숫자배열 → agg → wide pivot
function aggregateToWide(
  rows: Row[],
  spec: Required<Pick<AggregationSpec, "agg">> & Omit<AggregationSpec, "agg">
): { wideData: Row[]; seriesKeys: string[]; xKey: string } {
  const { xKey, yKey, seriesKey, agg, interval, chart, dateFilter } = spec;

  // 0) pre: date filtering + time bucket + topK
  let pre = rows;

  // 날짜 필터링 먼저 적용 (interval: "date"일 때 특정 날짜만)
  if (dateFilter && xKey) {
    pre = filterByDate(pre, dateFilter, xKey);
  }

  const _xKey = xKey ?? "__x"; // pie/donut에서 xKey가 없을 수 있음

  // time bucket 적용: xKey가 있고 temporal이면 bucket화
  if (xKey && interval) {
    pre = pre.map((r) => {
      const d = r[xKey];
      const bx = isValidDate(d)
        ? bucketTime(toDate(d), interval, dateFilter)
        : String(d ?? "");
      return { ...r, __bucket_x: bx };
    });
  }

  // 차트 타입별 topK 집계 방식 분기
  let topKApplied = pre;
  if (spec.topK && seriesKey) {
    if (chart === "pie" || chart === "donut") {
      topKApplied = applyGlobalTopK(
        pre,
        xKey ? (interval ? "__bucket_x" : xKey) : undefined,
        seriesKey,
        yKey,
        agg,
        spec.topK
      );
    } else {
      topKApplied = xKey
        ? applyPerXTopK(
            pre,
            interval ? "__bucket_x" : xKey,
            seriesKey,
            yKey,
            agg,
            spec.topK
          )
        : applyGlobalTopK(pre, undefined, seriesKey, yKey, agg, spec.topK);
    }
  }

  // 1) (x, series) 그룹핑
  type Key = string;
  const group = new Map<Key, number[]>();
  const seriesSet = new Set<string>();

  for (const r of topKApplied) {
    const xv = xKey
      ? String(interval ? r["__bucket_x"] : r[xKey])
      : seriesKey
      ? String(r[seriesKey])
      : "All";
    const sv = seriesKey ? String(r[seriesKey]) : "__single";
    seriesSet.add(sv);

    const v =
      agg === "count" || !yKey
        ? 1
        : typeof r[yKey] === "number"
        ? (r[yKey] as number)
        : +r[yKey];

    const key = `${xv}||${sv}`;
    if (!group.has(key)) group.set(key, []);
    group.get(key)!.push(isFinite(v) ? v : 0);
  }

  // 2) (x, series) → 집계값
  type XBucket = string;
  const byX = new Map<XBucket, Record<string, number>>();
  for (const [key, arr] of group) {
    const [xv, sv] = key.split("||");
    const val = aggregate(arr, agg);
    if (!byX.has(xv)) byX.set(xv, {});
    byX.get(xv)![sv] = val;
  }

  // 3) wide pivot: { xKey:'bucket', [seriesKey or default]: value }
  const seriesKeys = seriesKey ? [...seriesSet].sort() : [...seriesSet]; // "__single"만 존재
  const xFieldName = xKey ? (interval ? "__bucket_x" : xKey) : "__x_as_series";

  const wideData = [...byX.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([xv, obj]) => {
      const row: Row = { [xFieldName]: xv };
      for (const s of seriesKeys) {
        const k = seriesKey ? s : "value";
        row[k] = obj[s] ?? 0;
      }
      return row;
    });

  return {
    wideData,
    seriesKeys: seriesKey ? seriesKeys : ["value"],
    xKey: xFieldName,
  };
}

/** 외부에서 쓰는 훅: spec + raw → wide + seriesKeys + xKey
 *  - AG Grid:
 */
export function useAggregation(spec: AggregationSpec, raw: Row[]) {
  const agg = spec.agg ?? "count";
  const safeSpec: AggregationSpec & { agg: AggType } = { ...spec, agg };

  const result = useMemo(() => {
    // 산점도는  원시 그대로 씀(집계없음). 여기선 wide 변환 대신 원시를 반환.
    if (spec.chart === "scatter") {
      const xKey = spec.xKey || "x";
      const yKey = spec.yKey || "y";
      // Recharts/AG 모두 long형도 사용 가능하니 그대로 반환
      return {
        mode: "long" as const,
        longData: raw,
        xKey,
        yKey,
        seriesKeys: spec.seriesKey ? [spec.seriesKey] : [],
        wideData: [] as Row[],
      };
    }

    // pie/donut: 별도 집계 로직으로 처리
    if (spec.chart === "pie" || spec.chart === "donut") {
      if (!spec.seriesKey) {
        // seriesKey가 없으면 단일 값
        return {
          mode: "wide" as const,
          wideData: [{ __x_as_series: "All", value: raw.length }],
          xKey: "__x_as_series",
          yKey: "value",
          seriesKeys: ["value"],
          longData: [] as Row[],
        };
      }

      // seriesKey별로 직접 집계
      const totals = new Map<string, number>();
      for (const r of raw) {
        const s = String(r[spec.seriesKey]);
        const v =
          spec.agg === "count" || !spec.yKey
            ? 1
            : typeof r[spec.yKey] === "number"
            ? r[spec.yKey]
            : +r[spec.yKey];
        const numericV = typeof v === "number" ? v : 0;
        totals.set(
          s,
          (totals.get(s) || 0) + (isFinite(numericV) ? numericV : 0)
        );
      }

      // Top-K 적용
      const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
      const topK = spec.topK ? sorted.slice(0, spec.topK) : sorted;
      const others = spec.topK ? sorted.slice(spec.topK) : [];

      // Others 합계 계산
      const othersSum = others.reduce((sum, [, value]) => sum + value, 0);
      const finalData = [...topK];
      if (othersSum > 0) {
        finalData.push(["Others", othersSum]);
      }

      // Wide 형태로 변환
      const wideData = [
        {
          __x_as_series: "All",
          ...Object.fromEntries(finalData),
        },
      ];
      const seriesKeys = finalData.map(([key]) => key);

      return {
        mode: "wide" as const,
        wideData,
        xKey: "__x_as_series",
        yKey: "value",
        seriesKeys,
        longData: [] as Row[],
      };
    }

    // bar/line/area/stacked → wide
    const { wideData, seriesKeys, xKey } = aggregateToWide(raw, safeSpec);
    return {
      mode: "wide" as const,
      wideData,
      xKey,
      yKey: seriesKeys.length === 1 ? seriesKeys[0] : undefined,
      seriesKeys,
      longData: [] as Row[],
    };
  }, [
    raw,
    spec.chart,
    spec.xKey,
    spec.yKey,
    spec.seriesKey,
    spec.interval,
    spec.topK,
    spec.dateFilter,
    agg,
  ]);

  return result;
}
