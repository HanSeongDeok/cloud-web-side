import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { memo } from "react";

const LabelCom = memo(() => {
    return (
        <div>
            <Label htmlFor="terms" className="text-base text-gray-300 font-bold">
                기본 종류
            </Label>
        </div>
    )
});

export default LabelCom;