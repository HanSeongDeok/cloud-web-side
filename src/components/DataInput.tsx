import { memo } from "react";
import { Input } from "@components/ui/input";

/**
 * 데이터 입력 컴포넌트 - ag-grid용
 * @returns 데이터 입력 컴포넌트
 */
const DataInput = memo(() => {
    return <Input
        placeholder="Filter data..."
        className="max-w-sm"
    />
})

export default DataInput;   