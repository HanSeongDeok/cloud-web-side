import { Label } from "@/components/ui/label"
import { memo } from "react";
import "@styles/Label.css";

const LabelCondition = memo(() => {
    return (
        <div>
            <Label htmlFor="terms" className="labelText">
                조건 설정
            </Label>
        </div>
    )
});

export default LabelCondition;