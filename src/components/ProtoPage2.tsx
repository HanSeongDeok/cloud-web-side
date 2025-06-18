import { memo } from "react";
import AccordionLayout from "@components/Acodian";
import DataTable from "@components/DataTable";

const ProtoPage2 = memo(() => {
    return (
        <div>
            <h1 className="font-bold"> Prototype Page TWO </h1>
            <p className="mt-4 text-muted-foreground">
                여기에 본문 콘텐츠가 들어갑니다.
            </p>
            <AccordionLayout/>
            <DataTable/>
        </div>)
});

export default ProtoPage2;