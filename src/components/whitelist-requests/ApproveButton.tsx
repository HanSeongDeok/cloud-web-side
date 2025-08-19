import React from "react";
import { Button } from "../ui/button";

interface PropertyApproveButtonProps {
  handleClick: () => void;
}

export const ApproveButton: React.FC<PropertyApproveButtonProps> = ({
  handleClick,
}) => {
  return (
    <Button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      size="md"
    >
      승인
    </Button>
  );
};
