import * as React from "react";
import { useFileTransferStore } from "@/stores/useFileTransferStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const StorageFloatButton: React.FC = () => {
  const uploads = useFileTransferStore((s) => s.uploads);
  const toggle = useFileTransferStore((s) => s.toggle);
  const visible = useFileTransferStore((s) => s.cardsVisible);
  // 실시간으로 진행 중인 업로드/다운로드 개수 계산
  const uploadInProgress = uploads.filter(
    (m) => m.status === "progress"
  ).length;
  const downloadInProgress = 0; // 현재 다운로드 기능 없음
  // downloads.filter(
  //   (m) => m.status === "progress"
  // ).length;
  const total = uploadInProgress + downloadInProgress;

  // 디버깅용 (나중에 제거)
  console.log("StorageFloatButton:", {
    total,
    uploadInProgress,
    downloadInProgress,
    uploads,
  });

  const handleToggle = () => {
    toggle();
  };

  return (
    <div className="fixed right-8 bottom-8 z-[9999] flex items-center gap-3">
      {/* 카드가 보이고 진행 중인 작업이 있을 때만 텍스트 표시 */}
      {visible && total > 0 && (
        <span className="text-[15px] font-medium text-amber-600 bg-amber-50 rounded-md px-3 py-1 shadow-sm">
          {uploadInProgress > 0 && `${uploadInProgress}개 업로드 중`}
          {uploadInProgress > 0 && downloadInProgress > 0 && " / "}
          {downloadInProgress > 0 && `${downloadInProgress}개 다운로드 중`}
        </span>
      )}

      <div className="relative">
        {/* 카드가 숨겨져 있고 진행 중인 작업이 있으면 badge 표시 */}
        {!visible && total > 0 && (
          <Badge
            variant="secondary"
            className="absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-[12px] bg-orange-500 text-white animate-pulse"
          >
            {total}
          </Badge>
        )}

        <Button
          variant="default"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 ease-out",
            "bg-primary hover:bg-primary/90 hover:scale-110 hover:shadow-xl",
            "transform active:scale-95"
          )}
          onClick={handleToggle}
          aria-label="전송 패널 토글"
        >
          {visible ? (
            <EyeOff className="h-6 w-6 text-primary-foreground transition-transform duration-200 hover:scale-110" />
          ) : (
            <Bell className="h-6 w-6 text-primary-foreground transition-transform duration-200 hover:scale-110" />
          )}
        </Button>
      </div>
    </div>
  );
};
export default StorageFloatButton;
