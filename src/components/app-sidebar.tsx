import { memo } from "react";
import { useSidebarStore } from "../store/useSidebarStore";

export const AppSidebar = memo(() => {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className="fixed left-0 top-0 z-50 h-full w-[200px] border-r bg-white"
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(-120px)",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 p-4">
          {/* 사이드바 내용 */}
        </div>
      </div>
    </div>
  );
}); 