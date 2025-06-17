import { Label } from "@/components/ui/label"
import { memo } from "react";

const LabelCondition = memo(() => {
    return (
        <div>
            <Label htmlFor="terms" className="text-base text-gray-300 font-bold">
                조건 설정
            </Label>
        </div>
    )
});

export default LabelCondition;