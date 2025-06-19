import { memo } from "react";
import { Input } from "@components/ui/input";
import type { Table } from "@tanstack/react-table";
import type { Payment } from "@/handlers/dataTable.config.handler";

/**
 * 데이터 입력 컴포넌트 필터로 TABLE ROW 값 필터링 기능
 * @param table 테이블 인스턴스
 * @returns 데이터 입력 컴포넌트
 */
const DataInput = memo (({ table }: { table: Table<Payment> }) => {
    return <Input
        placeholder="Filter emails..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
    />
})

export default DataInput;   