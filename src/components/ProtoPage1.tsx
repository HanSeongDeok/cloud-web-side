import { memo } from "react";
import DataTable from "@/components/DataTable";
import AccordionLayout from "@components/Acodian";

const ProtoPage1 = memo(() => {
    return (
        <div className="w-full px-6 py-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Prototype Page ONE</h1>
                <p className="text-muted-foreground">
                    여기에 본문 콘텐츠가 들어갑니다.
                </p>
            </div>
            <div className="space-y-6">
                <AccordionLayout/>
                <DataTable/>
            </div>
        </div>
    )
});

export default ProtoPage1;