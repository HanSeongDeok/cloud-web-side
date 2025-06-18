import { memo } from "react";
import "@styles/ProtoPage3.css";
import DashBoard from "./DashBoard";

const ProtoPage3 = memo(() => {
    return (
        <div>
            <h1 className="font-bold">Prototype Page THREE</h1>
            <p className="mt-4 text-muted-foreground">
                여기에 본문 콘텐츠가 들어갑니다.
            </p>
            <DashBoard />
        </div>
    );
});

export default ProtoPage3;