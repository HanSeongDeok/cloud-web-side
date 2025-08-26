// 이 버튼은 DbPropertyTable 컴포넌트에서 사용되며, ag grid table의 위에(header 영역)에 위치 해야함
// 새 속성을 추가하는 기능을 제공합니다 (속성 추가 모달 창 open).
///src/ui/button.tsx 의 Button 컴포넌트를 사용합니다.

import React from "react";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";

interface PropertyMinusButtonProps {
  onRemoveProperty: () => void;
  disabled?: boolean;
}

export const PropertyMinusButton: React.FC<PropertyMinusButtonProps> = ({
  onRemoveProperty,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onRemoveProperty();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      variant={disabled ? "ghost" : undefined}
      size="default"
      className={`shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${
        !disabled ? "bg-red-600 text-white hover:bg-red-700" : ""
      }`}
      title={
        disabled ? "BUILT_IN 속성은 삭제할 수 없습니다" : "선택된 속성 삭제"
      }
    >
      <Minus className="w-4 h-4" />
    </Button>
  );
};
