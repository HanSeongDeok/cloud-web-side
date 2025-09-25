import React from "react";
import { PropertyAddButton } from "./PropertyAddButton";
import { PropertyMinusButton } from "./PropertyMinusButton";

interface DbConfigHeaderProps {
  onAddProperty: () => void;
  onRemoveProperty: () => void;
  isRemoveDisabled?: boolean;
}

const DbConfigHeader: React.FC<DbConfigHeaderProps> = ({
  onAddProperty,
  onRemoveProperty,
  isRemoveDisabled = false,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">DB 속성 테이블</h2>
      <div className="flex gap-2">
        <PropertyMinusButton
          onRemoveProperty={onRemoveProperty}
          disabled={isRemoveDisabled}
        />
        <PropertyAddButton onAddProperty={onAddProperty} />
      </div>
    </div>
  );
};

export default DbConfigHeader;
