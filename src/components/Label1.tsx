import { Label } from "@/components/ui/label"
import { memo } from "react";
import "@styles/Label.css";

const LabelBase = memo(() => {
    return (
        <div>
            <Label htmlFor="terms" className="labelText">
                기본 분류
            </Label>
        </div>
    )
});

export default LabelBase;