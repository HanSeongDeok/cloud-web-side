import React from "react";
import { Button } from "../ui/button";

interface PropertyRejectButtonProps {
  handleClick: () => void;
}

export const RejectButton: React.FC<PropertyRejectButtonProps> = ({
  handleClick,
}) => {
  return (
    <Button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-600 text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      size="md"
    >
      거절
    </Button>
  );
};
