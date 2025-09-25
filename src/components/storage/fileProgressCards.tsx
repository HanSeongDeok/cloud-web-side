import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useFileTransferStore } from "../../stores/useFileTransferStore";
import { BadgeCheck, CircleAlert, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import "react-toastify/dist/ReactToastify.css";

// 업로드 건별 토스트 컴포넌트
const UploadToastContent: React.FC<{
  sessionId: string;
  type: "upload" | "download";
  closeToast: () => void;
}> = ({ sessionId, type, closeToast }) => {
  // 업로드/다운로드 건별 정보 구독
  const { uploads, downloads } = useFileTransferStore();
  const transfer = (
    type === "upload"
      ? uploads.find((u) => u.sessionId === sessionId && u.type === type)
      : downloads.find((d) => d.sessionId === sessionId && d.type === type)
  ) as (typeof uploads)[number] | (typeof downloads)[number] | undefined;

  // 저장된 정보가 없으면 null 반환 (삭제된 경우)
  if (!transfer) return null;

  // 업로드/다운로드 메시지 처리
  const items = (transfer as any).items || [];
  const fileCount = items.length;
  const completedFiles = items.filter(
    (m: any) => m.status === "SUCCESS"
  ).length;

  return (
    <div
      className="flex items-center justify-between w-full h-full"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex-none ">
        {(() => {
          switch (transfer.status) {
            case "FAILED":
              return <CircleAlert className="stroke-red-500" />;
            case "SUCCESS":
              return <BadgeCheck className="stroke-green-500" />;
            case "PROGRESS":
              return <Loader2 className="stroke-blue-500 animate-spin" />;
            default:
              return <Loader2 className="stroke-blue-500" />;
          }
        })()}
      </div>
      <div className="flex-1 min-w-0 w-full px-4">
        <Tooltip>
          <TooltipTrigger className="w-full">
            <div className="w-full">
              <div className="cursor-pointer">
                <div className="font-medium text-sm text-gray-900">
                  {transfer.type === "upload" ? "업로드" : "다운로드"}{" "}
                  {transfer.type === "upload" && (
                    <span>
                      {completedFiles}/{fileCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {transfer.status === "PROGRESS" && (
                  <div className="text-blue-600">
                    <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, transfer.progress || 0)
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="truncate">
                      {transfer.type === "upload" ? "업로드" : "다운로드"} 중...{" "}
                      {transfer.progress}%
                    </div>
                  </div>
                )}

                {transfer.status === "SUCCESS" && (
                  <div className="text-green-600 truncate">
                    {transfer.type === "upload" ? "업로드" : "다운로드"} 완료
                  </div>
                )}

                {transfer.status === "FAILED" && (
                  <div className="text-red-600 truncate">
                    {transfer.type === "upload" ? "업로드" : "다운로드"} 실패
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>
          {items.length > 0 && (
            <TooltipContent side="top" align="start" style={{ zIndex: 10000 }}>
              <div className="bg-gray-800 text-white text-sm rounded-lg p-4 border border-gray-600 shadow-2xl">
                <div className="font-medium text-gray-200 mb-2">
                  {transfer.type === "upload" ? "업로드" : "다운로드"} 파일
                  리스트 ({items.length}개)
                </div>
                <div className="overflow-y-auto max-h-44 space-y-0">
                  {transfer.type === "upload" &&
                    items.map((item: any, index: number) => (
                      <div key={item.id}>
                        <div className="flex items-center gap-3 py-2 px-1 hover:bg-gray-700 hover:bg-opacity-50 rounded transition-colors">
                          <div className="flex-shrink-0">
                            {item.status === "PROGRESS" && (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            )}
                            {item.status === "SUCCESS" && (
                              <BadgeCheck className="w-4 h-4 text-green-400" />
                            )}
                            {item.status === "FAILED" && (
                              <CircleAlert className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="truncate text-white cursor-help"
                              title={
                                Array.isArray(item.fileName)
                                  ? item.fileName.join(", ")
                                  : item.fileName
                              }
                            >
                              {Array.isArray(item.fileName)
                                ? item.fileName.join(", ")
                                : item.fileName}
                            </div>
                            {item.status === "PROGRESS" && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-300 font-mono">
                                  {item.progress}%
                                </span>
                              </div>
                            )}
                            {item.status === "FAILED" && item.error && (
                              <div
                                className="text-xs text-red-300 mt-1 truncate"
                                title={item.error}
                              >
                                {item.error}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < items.length - 1 && (
                          <div className="border-b border-gray-600 opacity-30"></div>
                        )}
                      </div>
                    ))}
                  {transfer.type === "download" &&
                    items.map((item: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center gap-3 py-2 px-1 hover:bg-gray-700 hover:bg-opacity-50 rounded transition-colors">
                          <div className="flex-1 min-w-0">
                            <div
                              className="truncate text-white cursor-help"
                              title={item}
                            >
                              {Array.isArray(item) ? item.join(", ") : item}
                            </div>
                            {item.status === "PROGRESS" && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-300 font-mono">
                                  {item.progress}%
                                </span>
                              </div>
                            )}
                            {item.status === "FAILED" && item.error && (
                              <div
                                className="text-xs text-red-300 mt-1 truncate"
                                title={item.error}
                              >
                                {item.error}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < items.length - 1 && (
                          <div className="border-b border-gray-600 opacity-30"></div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      <div className="flex-none self-start">
        <Button
          onClick={closeToast}
          size="xs"
          variant="default"
          className="hover:bg-gray-100 !p-1 !h-6 !w-6 ml-2"
          title={transfer.status === "PROGRESS" ? "취소" : "닫기"}
        >
          <X className="h-3 w-3 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

// 메인 컴포넌트 (업로드 건별 토스트 관리)
const FileProgressCards: React.FC = React.memo(() => {
  const { uploads, downloads, cardsVisible, cancelUpload, removeProgress } =
    useFileTransferStore();

  // 업로드/다운로드 건별 토스트 표시
  React.useEffect(() => {
    [...uploads, ...downloads].forEach((item) => {
      const toastId = `${item.type}-${item.sessionId}`;

      if (!toast.isActive(toastId)) {
        toast(
          ({ closeToast }) => (
            <UploadToastContent
              sessionId={item.sessionId}
              type={item.type}
              closeToast={closeToast}
            />
          ),
          {
            toastId,
            autoClose: false, // 자동 닫힘 비활성화
            //완료된 상태면 해당 상태 삭제
            onClose() {
              const current = useFileTransferStore
                .getState()
                [item.type === "upload" ? "uploads" : "downloads"].find(
                  (m) => m.sessionId === item.sessionId
                );
              switch (current?.status) {
                case "PROGRESS":
                  cancelUpload(item.sessionId);
                  break;
                case "SUCCESS":
                case "FAILED":
                  removeProgress(item.sessionId, item.type);
                  break;
                default:
                  break;
              }
            },
          }
        );
      }
    });
  }, [uploads, downloads, cancelUpload, removeProgress]);

  return (
    <TooltipProvider delayDuration={300}>
      <ToastContainer
        position="bottom-right"
        stacked
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        closeButton={false}
        style={{
          bottom: "5rem",
          right: "1.25rem",
          maxWidth: "20rem",
          // maxHeight: "30rem",
          visibility: cardsVisible ? "visible" : "hidden",
          opacity: cardsVisible ? 1 : 0,
          zIndex: 9999, // react-toastify 기본값
        }}
      />
    </TooltipProvider>
  );
});

FileProgressCards.displayName = "FileProgressCards";

export default FileProgressCards;
