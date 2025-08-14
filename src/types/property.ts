export type DataType = "TEXT" | "NUMBER" | "DATE" | "BOOLEAN";
export type PropertyType = "BUILT_IN" | "USER_DEFINED";
export type DeleteRequestStatus = "IN_USE" | "DELETE_REQUESTED" | "DELETED";

// DbProperty 기본 인터페이스
export interface DbProperty {
  id: number;
  name: string;
  data_type: DataType;
  property_type: PropertyType;
  use_lut: 0 | 1; // 0: 사용안함(자율 양식), 1: 사용(lut 사용)
  is_active: boolean;
  delete_request_status: DeleteRequestStatus;
  created_by: number; // 사용자 ID
  created_at: Date;
  updated_at: Date;
  description: string;
}

// 새로운 속성 생성을 위한 타입 (id 제외)
export type NewDbProperty = Omit<
  DbProperty,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_active"
  | "delete_request_status"
  | "created_by"
  | "property_type"
>;

// 속성의 부분 집합을 나타내는 타입 (업데이트, 컬럼 정의 등에서 사용)
export type PartialDbProperty = Partial<DbProperty>;
