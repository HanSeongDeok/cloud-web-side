export interface columnHeader {
    registration_number: string;
    name: string;
    filesize: string;
    file_format: string;
    modification_date: string;
    description: string;
    upload_at: string;
    vehicle: string;
    test_type: string;
    dev_step: string;
    test_item: string;
    ecu: string;
    test_result: string;
    deliverable_type: string;
    pt_type: string;
    sw_ver: string;
    tc_num: string;
    uploaded_by: string;
    group_name: string;
    group_description: string;
    custom_metadata: string;
}

export const columnHeaderNames: columnHeader = {
    registration_number: "registration_number",
    name: "name",
    filesize: "filesize",
    file_format: "file_format",
    modification_date: "modification_date",
    description: "description",
    upload_at: "upload_at",
    vehicle: "vehicle",
    test_type: "test_type",
    dev_step: "dev_step",
    test_item: "test_item",
    ecu: "ecu",
    test_result: "test_result",
    deliverable_type: "deliverable_type",
    pt_type: "pt_type",
    sw_ver: "sw_ver",
    tc_num: "tc_num",
    uploaded_by: "uploaded_by",
    group_name: "group_name",
    group_description: "group_description",
    custom_metadata: "custom_metadata",
}