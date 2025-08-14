// 이 버튼은 DbPropertyTable 컴포넌트에서 사용되며, ag grid table의 위에(header 영역)에 위치 해야함
// 새 속성을 추가하는 기능을 제공합니다 (속성 추가 모달 창 open).
///src/ui/button.tsx 의 Button 컴포넌트를 사용합니다.

import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface PropertyAddButtonProps {
  onAddProperty: () => void;
}

export const PropertyAddButton: React.FC<PropertyAddButtonProps> = ({
  onAddProperty,
}) => {
  const handleClick = () => {
    onAddProperty();
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      size="default"
    >
      <Plus className="w-4 h-4" />
    </Button>
  );
};
