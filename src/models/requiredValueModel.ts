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
  700: { // 시험보고서(1)
    200: [ // 실차적합성(1)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: false },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    201: [ // 사이버보안(2)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: false },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    202: [ // OTA(3)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: false },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    203: [ // 캠페인(4)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: false },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: true },
      { field: "description", required: true },
    ],
    204: [ // 실도로주행(5)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ]
  },
  701: { // 차량데이터(2)
    200: [ // 실차적합성(1)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    201: [ // 사이버보안(2)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    202: [ // OTA(3)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    203: [ // 캠페인(4)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: true },
      { field: "description", required: false },
    ],
    204: [ // 실도로주행(5)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ]
  },
  702: { // 증적자료(3)
    200: [ // 실차적합성(1)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    201: [ // 사이버보안(2)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    202: [ // OTA(3)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    203: [ // 캠페인(4)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: true },
      { field: "testItem", required: true },
      { field: "testResult", required: true },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ],
    204: [ // 실도로주행(5)
      { field: "deliverableType", required: true },
      { field: "testClassification", required: true },
      { field: "vehicle", required: true },
      { field: "PTtype", required: true },
      { field: "drivetype", required: true },
      { field: "devStep", required: true },
      { field: "ecu", required: false },
      { field: "testItem", required: false },
      { field: "testResult", required: false },
      { field: "tcNum", required: false },
      { field: "swVer", required: false },
      { field: "description", required: false },
    ]
  }
};

// 헬퍼 함수들
export const getRequiredFields = (deliverableType: number, testClassification: number): RequiredField[] => {
  return requiredData[deliverableType]?.[testClassification] || [];
};

export const isFieldRequired = (deliverableType: number, testClassification: number, fieldName: string): boolean => {
  const fields = getRequiredFields(deliverableType, testClassification);
  return fields.find(field => field.field === fieldName)?.required || false;
};

export const getFieldValue = (deliverableType: number, testClassification: number, fieldName: string): string | number | undefined => {
  const fields = getRequiredFields(deliverableType, testClassification);
  return fields.find(field => field.field === fieldName)?.value;
};
