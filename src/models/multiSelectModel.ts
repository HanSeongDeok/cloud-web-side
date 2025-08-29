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
    { id: "r-mdps", label: "R-MDPS" },
    { id: "c-mdps", label: "C-MDPS" },
    { id: "sbw", label: "SbW" },
    { id: "ieb", label: "IEB" },
    { id: "esc", label: "ESC" },
    { id: "epb", label: "EPB" },
    { id: "ecs", label: "ECS" },
    { id: "awd", label: "AWD" },
    { id: "elsd", label: "eLSD" },
    { id: "vpc", label: "VPC" },
    { id: "vcu", label: "VCU" },
];

export const stepOptions: MultiSelectOption[] = [
    { id: "t-car", label: "T-Car" },
    { id: "proto", label: "Proto" },
    { id: "m-car", label: "M/Car" },
    { id: "p1", label: "P1" },
    { id: "p2", label: "P2" },
    { id: "sp1", label: "SP1" },
    { id: "sp2", label: "SP2" },
    { id: "m", label: "M" },
];

export const deliverableTypeOptions: MultiSelectOption[] = [
    { id: "test-report", label: "시험보고서(1)" },
    { id: "vehicle-data", label: "차량데이터(2)" },
    { id: "evidence-data", label: "증적자료(3)" },
    { id: "campaign", label: "캠페인(4)" },
    { id: "real-road-driving", label: "실도로주행(5)" },
];

export const testClassificationOptions: MultiSelectOption[] = [
    { id: "vehicle-compliance", label: "실차적합성(1)" },
    { id: "cyber-security", label: "사이버보안(2)" },
    { id: "ota", label: "OTA(3)" },
    { id: "real-road-driving", label: "실도로주행(5)" },
];

export const driveTypeOptions: MultiSelectOption[] = [
    { id: "ice", label: "ICE" },
    { id: "hev", label: "HEV" },
    { id: "phev", label: "PHEV" },
    { id: "ev", label: "EV" },
    { id: "erev", label: "EREV" },
];

// TestItem을 3개 컬럼으로 세분화
export const testItem1Options: MultiSelectOption[] = [
    { id: "layout-review", label: "레이아웃검토" },
    { id: "io-signal", label: "입출력신호" },
    { id: "dark-current", label: "암전류" },
    { id: "esd-impact", label: "정전기영향성" },
    { id: "basic-control", label: "기본제어" },
    { id: "system-interface", label: "시스템인터페이스" },
    { id: "malicious-test", label: "악의시험" },
    { id: "past-vehicle-issues", label: "과거차문제점" },
    { id: "high-speed-can", label: "고속 CAN통신" },
    { id: "fault-diagnosis", label: "고장진단및 Fail Safe" },
    { id: "diagnostic-communication", label: "진단통신" },
    { id: "sw-update-regulation", label: "SW업데이트법규 _RXSWIN" },
    { id: "vehicle-unit-controller", label: "차량단위제어기리셋기능" },
    { id: "real-road-driving-evaluation", label: "실도로주행평가" },
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

export const resultOptions: MultiSelectOption[] = [
    { id: "pass", label: "PASS" },
    { id: "fail", label: "FAIL" },
    { id: "ok", label: "OK" },
    { id: "ng", label: "NG" },
];

export const memTypeOptions: MultiSelectOption[] = [
    { id: "single", label: "단일" },
    { id: "dual", label: "이중화" },
];