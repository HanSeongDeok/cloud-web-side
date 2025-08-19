import React from "react";
import type { ICellRendererParams } from "ag-grid-community";
import type { PermissionRequestUser } from "@/types/whitelist";

interface UserInfoCellProps extends ICellRendererParams {
  data: PermissionRequestUser;
}

export const UserInfoCell: React.FC<UserInfoCellProps> = ({ data }) => {
  if (!data) return null;

  const getInitial = (name: string) => {
    return name ? name.charAt(0) : "?";
  };

  const getAvatarStyle = (name: string) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return {
      background: gradients[index],
    };
  };
  return (
    <div className="w-96 h-20 relative">
      <div
        className="w-14 h-14 left-[16px] top-[12px] absolute rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0"
        style={getAvatarStyle(data.name)}
      >
        {getInitial(data.name)}
      </div>
      <div className="user-details">
        <div className="left-[88.15px] top-[2px] absolute justify-start text-black text-xl font-medium font-['Inter']">
          {data.name}
        </div>

        <div
          data-status="active"
          className="left-[95.15px] top-0 absolute inline-flex justify-start items-start"
        />

        <div className="w-28 left-[88.79px] top-[33px] absolute justify-start text-zinc-600 text-base font-medium font-['Inter']">
          사번: {data.employeeId}
        </div>

        <div className="w-44 left-[244.43px] top-[33px] absolute justify-start text-zinc-600 text-base font-medium font-['Inter']">
          {data.email}
        </div>

        {data.team && (
          <div className="left-[88.79px] top-[59px] absolute bg-indigo-100 rounded-[20px] px-3 py-1 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-medium font-['Inter'] whitespace-nowrap">
              {data.team}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
