import React, { useState } from "react";
import { X, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "./button";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  showCancel?: boolean;
  cancelText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = "확인",
  onConfirm,
  showCancel = false,
  cancelText = "취소",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isProcessing) return; // 이미 처리 중이면 무시

    setIsProcessing(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Modal confirm action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          title: "text-green-800",
          message: "text-green-700",
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          title: "text-red-800",
          message: "text-red-700",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          title: "text-yellow-800",
          message: "text-yellow-700",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-800",
          message: "text-blue-700",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md mx-auto shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-white/20 transform animate-in zoom-in-95 duration-200">
        {/* 아이콘 영역 - 상단 중앙 */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div
            className={`p-2 rounded-full ${colors.bg} ${colors.border} border-2 mb-3 shadow-lg`}
          >
            {getIcon()}
          </div>
          <h2 className={`text-xl font-bold ${colors.title} text-center mb-2`}>
            {title}
          </h2>
          <p
            className={`text-sm ${colors.message} text-center px-6 leading-relaxed whitespace-pre-wrap`}
          >
            {message}
          </p>
        </div>

        {/* 버튼 영역 - 한 행에 나란히 */}
        <div className="flex flex-row gap-3 p-6 pt-2">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`${showCancel ? "w-1/2" : "w-full"} h-12 ${
              colors.button
            } text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                처리 중...
              </div>
            ) : (
              confirmText
            )}
          </Button>
          {showCancel && (
            <Button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-1/2 h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {cancelText}
            </Button>
          )}
        </div>

        {/* 닫기 버튼 - 우상단 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
