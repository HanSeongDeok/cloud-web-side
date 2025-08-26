// property_lut 기본 인터페이스
export interface LutItem {
  id: number;
  propertyMetadataId: number; // 속성 메타데이터 ID
  lutValue: string;
  description: string | null; // 설명 (null 가능)
  sortOrder: number; // 정렬 순서
  createdBy: number; // 사용자 ID
  createdAt: Date;
  isActive: boolean; // 활성화 여부 (선택적, 기본값: false)
}

// 새로운 속성 생성을 위한 타입
export type NewLutItem = Omit<
  LutItem,
  | "id"
  | "sortOrder"
  | "createdAt"
  | "createdBy"
  | "propertyMetadataId"
  | "isActive"
>;

// 속성의 부분 집합을 나타내는 타입 (업데이트, 컬럼 정의 등에서 사용)
export type PartialLutItem = Partial<LutItem>;
