export interface MultiSelectOption {
    id: string;
    label: string;
}

export const typeOptions: MultiSelectOption[] = [
    { id: "file", label: "FILE" },
    { id: "folder", label: "FOLDER" },
];

// 각 MultiSelect의 옵션 정의
export const vehicleOptions: MultiSelectOption[] = [
    { id: "all", label: "ALL" },
    { id: "rg3", label: "RG3" },
    { id: "sp2pe", label: "SP2PE" },
    { id: "mx5", label: "MX5" },
    { id: "ka4pe", label: "KA4PE" },
    { id: "kona", label: "KONA" },
    { id: "avante", label: "AVANTE" },
    { id: "ioniq", label: "IONIQ" },
    { id: "sonata", label: "SONATA" },
    { id: "grandeur", label: "GRANDEUR" },
    { id: "porter", label: "PORTER" },
    { id: "staria", label: "STARIA" },
    { id: "casper", label: "CASPER" },
    { id: "gv80", label: "GV80" },
    { id: "gv70", label: "GV70" },
    { id: "gv90", label: "GV90" },
    { id: "konaev", label: "KONAEV" },
    { id: "avanteev", label: "AVANTEEV" },
    { id: "ioniqev", label: "IONIQEV" },
    { id: "sonataev", label: "SONATAEV" },
    { id: "grandeurev", label: "GRANDEUREV" },
    { id: "porterev", label: "PORTEREV" },
    { id: "stariasev", label: "STARIASEV" },
];

export const ecuOptions: MultiSelectOption[] = [
    { id: "R-MDPS", label: "R-MDPS" },
    { id: "C-MDPS", label: "C-MDPS" },
    { id: "SbW", label: "SbW" },
    { id: "IEB", label: "IEB" },
    { id: "ESC", label: "ESC" },
    { id: "EPB", label: "EPB" },
    { id: "ECS", label: "ECS" },
    { id: "AWD", label: "AWD" },
    { id: "eLSD", label: "eLSD" },
    { id: "VPC", label: "VPC" },
    { id: "VCU", label: "VCU" },
];

export const devstepOptions: MultiSelectOption[] = [
    { id: "T-Car", label: "T-Car" },
    { id: "프로토", label: "프로토" },
    { id: "M/Car", label: "M/Car" },
    { id: "P1", label: "P1" },
    { id: "P2", label: "P2" },
    { id: "SP1", label: "SP1" },
    { id: "SP2", label: "SP2" },
    { id: "양산", label: "양산" },
];

export const deliverableTypeOptions: MultiSelectOption[] = [
    { id: "시험보고서", label: "시험보고서" },
    { id: "차량데이터", label: "차량데이터" },
    { id: "증적자료", label: "증적자료" },
];

export const testClassificationOptions: MultiSelectOption[] = [
    { id: "실차적합성", label: "실차적합성" },
    { id: "사이버보안", label: "사이버보안" },
    { id: "OTA", label: "OTA" },
    { id: "캠페인", label: "캠페인" },
    { id: "실도로주행", label: "실도로주행" },
];

export const ptTypeOptions: MultiSelectOption[] = [
    { id: "ICE", label: "ICE" },
    { id: "HEV", label: "HEV" },
    { id: "PHEV", label: "PHEV" },
    { id: "EV", label: "EV" },
    { id: "EREV", label: "EREV" },
];

// TestItem을 3개 컬럼으로 세분화
export const testItem1Options: MultiSelectOption[] = [
    { id: "레이아웃검토", label: "레이아웃검토" },
    { id: "입출력신호", label: "입출력신호" },
    { id: "암전류", label: "암전류" },
    { id: "정전기영향성", label: "정전기영향성" },
    { id: "기본제어", label: "기본제어" },
    { id: "시스템인터페이스", label: "시스템인터페이스" },
    { id: "악의시험", label: "악의시험" },
    { id: "과거차문제점", label: "과거차문제점" },
    { id: "고속 CAN통신", label: "고속 CAN통신" },
    { id: "고장진단및 Fail Safe", label: "고장진단및 Fail Safe" },
    { id: "진단통신", label: "진단통신" },
    { id: "SW업데이트법규 _RXSWIN", label: "SW업데이트법규 _RXSWIN" },
    { id: "차량단위제어기리셋기능", label: "차량단위제어기리셋기능" },
    { id: "실도로주행평가", label: "실도로주행평가" },
];

export const testItem2Options: MultiSelectOption[] = [
    { id: "secure-flash", label: "Secure Flash" },
    { id: "prevent-sw-downgrade", label: "Prevent SW Downgrade" },
    { id: "advanced-seedkey", label: "Advanced SeedKey" },
    { id: "uds-security-func", label: "UDS security Fucn" },
];

export const testItem3Options: MultiSelectOption[] = [
    { id: "normal-update", label: "Normal Update" },
    { id: "rollback", label: "Rollback" },
    { id: "final-fail", label: "FinalFail" },
];

// 기존 testItemOptions는 모든 항목을 포함하는 통합 버전으로 유지
export const testItemOptions: MultiSelectOption[] = [
    ...testItem1Options,
    ...testItem2Options,
    ...testItem3Options,
];

export const result1Options: MultiSelectOption[] = [
    { id: "PASS", label: "PASS" },
    { id: "FAIL", label: "FAIL" },
];

export const result2Options: MultiSelectOption[] = [
    { id: "OK", label: "OK" },
    { id: "NG", label: "NG" },
];

export const memTypeOptions: MultiSelectOption[] = [
    { id: "단일", label: "단일" },
    { id: "이중화", label: "이중화" },
];

export const depArrOptions: MultiSelectOption[] = [
    { id: "dep1", label: "dep1" },
    { id: "dep2", label: "dep2" },
    { id: "dep3", label: "dep3" },
];

/**
 * TODO 추후 LUT API를 통해 받아온 뒤 동적 매핑 되어야함.
 * 현재는 테스트 용으로 하드코딩 된 실제 예시 데이터를 사용함.
 * 
 * 해당 id 값이 columns header에 존재하지 않으면 disabled 처리. 
 */
export const lutOptions: Record<string, MultiSelectOption[]> = {
    deliverableType: [
        ...deliverableTypeOptions
    ],
    testClassification: [
        ...testClassificationOptions
    ],
    vehicle: [
        ...vehicleOptions
    ],
    ptType: [
        ...ptTypeOptions
    ],
    devStep: [
        ...devstepOptions
    ],
    ecu: [
        ...ecuOptions
    ],
    testItem: [
        ...testItem1Options,
        ...testItem2Options,
        ...testItem3Options,
    ],
    testResult: [
        ...result1Options,
        ...result2Options,
    ],
    memType: [
        ...memTypeOptions
    ],
    depArr: [
        ...depArrOptions
    ],
};