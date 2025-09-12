// src/models/requiredValue.ts
export interface RequiredField {
  field: string;
  required: boolean;
  value?: string | number;
}

export interface RequiredData {
  [deliverableType: string]: {
    [testClassification: string]: RequiredField[];
  };
}

export const requiredData: RequiredData = {
  "test-report": { // 시험보고서(1)
    "vehicle-compliance": [ // 실차적합성(1)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
      { field: "memType", required: false },
      { field: "depArr", required: false }
    ],
    "cyber-security": [ // 사이버보안(2)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
      { field: "memType", required: false },
      { field: "depArr", required: false }
    ],
    "ota": [ // OTA(3)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
      { field: "memType", required: false },
      { field: "depArr", required: false }
    ],
    "campaign": [ // 캠페인(4)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: true },
      { field: "desc", required: true },
    ],
    "real-road-driving": [ // 실도로주행(5)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ]
  },
  "vehicle-data": { // 차량데이터(2)
    "vehicle-compliance": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcnum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ],
    "cyber-security": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },   
    ],
    "ota": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ],
    "campaign": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: true },
      { field: "desc", required: false },
    ],
    "real-road-driving": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ]
  },
  "evidence-data": { // 증적자료(3)
    "vehicle-compliance": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },   
    ],
    "cyber-security": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },  
      { field: "desc", required: false },
    ],
    "ota": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },  
      { field: "desc", required: false },
    ],
    "campaign": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ],
    "real-road-driving": [
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      // { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "desc", required: false },
    ]
  }
};

// 헬퍼 함수들
export const getRequiredFields = (deliverableType: string, testClassification: string): RequiredField[] => {
  return requiredData[deliverableType]?.[testClassification] || [];
};

export const isFieldRequired = (deliverableType: string, testClassification: string, fieldName: string): boolean => {
  const fields = getRequiredFields(deliverableType, testClassification);
  return fields.find(field => field.field === fieldName)?.required || false;
};

export const getFieldValue = (deliverableType: string, testClassification: string, fieldName: string): string | number | undefined => {
  const fields = getRequiredFields(deliverableType, testClassification);
  return fields.find(field => field.field === fieldName)?.value;
};
