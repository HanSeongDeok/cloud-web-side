import type { ColDef } from "ag-grid-community";

export type Column = {
  name: string;
  dataType: string;
  useLut: string;
  description: string;
  propertyType: string;
};

/**
 * 속성 이름 컬럼 생성
 * @returns 속성 이름 컬럼
 */
const createNameColumn = (name: string): ColDef<Column> => {
  return {
    headerName: name,
    field: "name",
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
    createNameColumn(columns.name),
    createDataTypeColumn(columns.dataType),
    createUseLutColumn(columns.useLut),
    createDescriptionColumn(columns.description),
    createPropertyTypeColumn(columns.propertyType),
  ];
};

// // 선택 변경 이벤트 핸들러
// export const onSelectionChanged = (event: SelectionChangedEvent) => {
//   const newMap = new Map<string, boolean>();
//   event.api.forEachNode((node) => {
//     newMap.set(node.id!, node.isSelected() || false);
//   });
//   useSelectionStore.getState().setSelectedMap(newMap);
// };

// // 행 클릭 이벤트 핸들러
// export const onRowClicked = (event: RowClickedEvent) => {
//   const target = event.event?.target as HTMLElement;
//   const api = event.api;
//   const clickedNode = event.node;
//   const selectedNodes = api.getSelectedNodes();
//   const isShift = (event.event as KeyboardEvent)?.shiftKey;
//   const isCtrl =
//     (event.event as KeyboardEvent)?.ctrlKey ||
//     (event.event as KeyboardEvent)?.metaKey;
//   const isSelected = useSelectionStore.getState().isSelected(clickedNode.id!);

//   if (
//     target.closest("button") ||
//     target.closest("svg") ||
//     target.closest(".no-select-cell")
//   ) {
//     clickedNode.setSelected(true);
//     return;
//   }

//   if (selectedNodes.length > 0 && !isCtrl) {
//     if (selectedNodes.includes(clickedNode) && selectedNodes.length === 1) {
//       clickedNode.setSelected(false);
//     } else if (!isShift) {
//       api.deselectAll();
//       clickedNode.setSelected(true);
//     }
//   } else {
//     clickedNode.setSelected(!isSelected);
//   }
// };
