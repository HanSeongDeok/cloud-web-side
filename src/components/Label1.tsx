import { Label } from "@/components/ui/label"
import { memo } from "react";

const LabelBase = memo(() => {
    return (
        <div>
            <Label htmlFor="terms" className="text-base text-gray-300 font-bold">
                기본 분류
            </Label>
        </div>
    )
});

export default LabelBase;