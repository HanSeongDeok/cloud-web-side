export type DataType = "TEXT" | "NUMBER" | "DATE" | "BOOLEAN";
export type PropertyType = "BUILT_IN" | "USER_DEFINED" | "SERVER_MANAGED";
export type DeleteRequestStatus = "IN_USE" | "DELETE_REQUESTED" | "DELETED";

// DbProperty 기본 인터페이스
export interface DbProperty {
  id: number;
  name: string;
  dataType: DataType;
  propertyType: PropertyType;
  useLut: boolean; // false: 사용안함(자율 양식), true: 사용(lut 사용)
  isActive: boolean;
  deleteRequestStatus: DeleteRequestStatus;
  createdBy: number; // 사용자 ID
  createdAt: Date;
  updatedAt: Date;
  description: string;
}

// 새로운 속성 생성을 위한 타입 (id 제외)
export type NewDbProperty = Omit<
  DbProperty,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "isActive"
  | "deleteRequestStatus"
  | "createdBy"
  | "propertyType"
>;

// 속성의 부분 집합을 나타내는 타입 (업데이트, 컬럼 정의 등에서 사용)
export type PartialDbProperty = Partial<DbProperty>;
