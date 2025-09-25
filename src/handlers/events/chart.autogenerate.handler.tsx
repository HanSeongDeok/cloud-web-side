import { type ChartSpec, type FieldMeta } from "@/types/dashboard";

const getLabel = (name?: string, FIELD_META: FieldMeta[] = []) =>
  name
    ? FIELD_META.find((n) => n.name === name)?.displayName || name
    : undefined;

const getUnit = (yKey?: string, FIELD_META: FieldMeta[] = []) => {
  if (!yKey) return "";
  const unit = FIELD_META.find((n) => n.name === yKey)?.unit;
  return unit ? ` (${unit})` : "";
};

const mapGrain = (g?: string) => {
  if (!g) return "";
  const timeGrain: { [key: string]: string } = {
    YEAR: "연간",
    MONTH: "월간",
    DAY: "일간",
  };
  return timeGrain[g] || g;
};

const inferPurpose = (spec: ChartSpec) => {
  const type = spec.chartType;
  if (type === "BAR") return "비교";
  if (type === "LINE" || type === "AREA") return "추이";
  if (type === "PIE") return "비중";
  if (type === "SCATTER" || type === "BUBBLE") return "상관";
  if (spec.topK && spec.topK > 0) return "순위";
  return "비교";
};

const join = (...parts: (string | undefined | false)[]) =>
  parts
    .filter(Boolean)
    .join(" ")
    .replace(/\series+/g, " ")
    .trim();

export function generateTitle(
  spec: ChartSpec,
  FIELD_META: FieldMeta[] = []
): string {
  const x = getLabel(spec.xKey, FIELD_META);
  const y = getLabel(spec.yKey, FIELD_META);
  const series = getLabel(spec.seriesKey, FIELD_META);
  const agg = spec.agg ? spec.agg.toUpperCase() : undefined; // 표시용
  const unit = getUnit(spec.yKey, FIELD_META);
  const grain = mapGrain(spec.time_grain);
  const purpose = inferPurpose(spec);
  const top = spec.topK && spec.topK > 0 ? `Top ${spec.topK}` : "";

  // 1) 공통 접두부: 기간/그레인 (있을 때만)
  // 예: "월간 기준" / "주간 기준"
  const prefix = grain && `${grain} 기준`;

  // 2) 본문 패턴들
  const yWithAgg = y ? `${y}${unit}${agg ? ` ${agg}` : ""}` : undefined;

  // 파이/도넛: 구성
  if (purpose === "비중" && x) {
    // 예: "이번 달 파일포맷 구성 — TestResult 합계 파일크기"
    const rhs = join(series, yWithAgg);
    return join(
      prefix && `${prefix} —`,
      `${x} 구성`,
      rhs && "—",
      rhs,
      top
    ).trim();
  }

  // 추이/비교(기본)
  if (x && series && y) {
    // 예: "월간 기준 업로드일별 TestResult 합계 파일크기 추이"
    return join(prefix, `${x}별`, series, yWithAgg, purpose, top).trim();
  }
  if (x && series && !y) {
    // 예: "업로드일별 TestResult 추이"
    return join(prefix, `${x}별`, series, purpose, top).trim();
  }
  if (x && !series && y) {
    // 예: "차종별 평균 파일크기 비교"
    return join(prefix, `${x}별`, yWithAgg, purpose, top).trim();
  }
  if (x && !series && !y) {
    // 예: "업로드일별 추이"
    return join(prefix, `${x}별`, purpose, top).trim();
  }
  if (!x && series && y) {
    // 예: "TestResult (파일크기 합계) 추이"
    return join(prefix, series, `(${yWithAgg})`, purpose, top).trim();
  }
  if (!x && series && !y) {
    // 예: "TestResult 추이"
    return join(prefix, series, purpose, top).trim();
  }
  if (!x && !series && y) {
    // 예: "파일크기 합계 추이"
    return join(prefix, yWithAgg, purpose, top).trim();
  }

  // 완전 최소 정보
  return join(prefix, "전체", purpose || "추이", top).trim();
}
