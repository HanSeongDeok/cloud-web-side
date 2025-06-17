import { memo } from "react";
import DataTable from "@components/DataTable";
import AspectRatioLayout from "@components/AspectRatio";

const ProtoPage1 = memo(() => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Prototype Page ONE</h1>
            <p className="mt-4 text-muted-foreground">
                여기에 본문 콘텐츠가 들어갑니다.
            </p>
            <AspectRatioLayout/>
            <DataTable/>
        </div>)
});

export default ProtoPage1;