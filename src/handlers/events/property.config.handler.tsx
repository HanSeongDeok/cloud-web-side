import type { ColDef } from "ag-grid-community";

export type Column = {
  displayName: string;
  dataType: string;
  useLut: string;
  description: string;
  propertyType: string;
};

/**
 * 속성 이름 컬럼 생성
 * @returns 속성 이름 컬럼
 */
const createDisplayNameColumn = (displayName: string): ColDef<Column> => {
  return {
    headerName: displayName,
    field: "displayName",
    flex: 1,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 속성 타입 컬럼 생성
 * @returns 속성 타입 컬럼
 */
const createDataTypeColumn = (dataType: string): ColDef<Column> => {
  return {
    headerName: dataType,
    field: "dataType",
    flex: 1,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 참조표 컬럼 생성
 * @returns 참조표 컬럼
 */
const createUseLutColumn = (useLut: string): ColDef<Column> => {
  return {
    headerName: useLut,
    field: "useLut",
    flex: 1,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 참조표 컬럼 생성
 * @returns 참조표 컬럼
 */
const createDescriptionColumn = (description: string): ColDef<Column> => {
  return {
    headerName: description,
    field: "description",
    flex: 1.5,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 속성 타입 컬럼 생성
 * @returns 속성 타입 컬럼
 */
const createPropertyTypeColumn = (propertyType: string): ColDef<Column> => {
  return {
    headerName: propertyType,
    field: "propertyType",
    flex: 1,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * AG-GRID 컬럼 정의
 * @param columns - 컬럼 정보
 * @returns ColDef 배열
 */
export const columnDefs = (columns: Column): ColDef<Column>[] => {
  return [
    createDisplayNameColumn(columns.displayName),
    createDataTypeColumn(columns.dataType),
    createUseLutColumn(columns.useLut),
    createDescriptionColumn(columns.description),
    createPropertyTypeColumn(columns.propertyType),
  ];
};
