import type { ColDef } from "ag-grid-enterprise";

export type Column = {
  id: string;
  userName: string;
  action: string;
  time: string;
  ip: string;
  message: string;
};

/**
 * 속성 이름 컬럼 생성
 * @returns 속성 이름 컬럼
 */
const createLogIdColumn = (): ColDef<Column> => {
  return {
    headerName: "로그 ID",
    field: "id",
    flex: 1,
    sortable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  };
};
/**
 * 참조표 컬럼 생성
 * @returns 참조표 컬럼
 */
const createTimeStampColumn = (): ColDef<Column> => {
  return {
    headerName: "타임스탬프",
    field: "time",
    flex: 1,
    sortable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 속성 이름 컬럼 생성
 * @returns 속성 이름 컬럼
 */
const createActionColumn = (): ColDef<Column> => {
  return {
    headerName: "액션",
    field: "action",
    flex: 1,
    sortable: false,
    filter: true,
    cellStyle: { textAlign: "center" },
  };
};
/**
 * 속성 타입 컬럼 생성
 * @returns 속성 타입 컬럼
 */
const createUserNameColumn = (): ColDef<Column> => {
  return {
    headerName: "사용자",
    field: "userName",
    flex: 1,
    sortable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 참조표 컬럼 생성
 * @returns 참조표 컬럼
 */
const createIpAddressColumn = (): ColDef<Column> => {
  return {
    headerName: "IP 주소",
    field: "ip",
    flex: 1.5,
    sortable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * 속성 타입 컬럼 생성
 * @returns 속성 타입 컬럼
 */
const createMessageColumn = (): ColDef<Column> => {
  return {
    headerName: "메시지",
    field: "message",
    flex: 1,
    sortable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  };
};

/**
 * AG-GRID 컬럼 정의 (상수)
 */
export const columnDefs: ColDef<Column>[] = [
  createLogIdColumn(),
  createTimeStampColumn(),
  createActionColumn(),
  createUserNameColumn(),
  createIpAddressColumn(),
  createMessageColumn(),
];
