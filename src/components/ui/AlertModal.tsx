import React from "react";
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
  onConfirm?: () => void;
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
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <XCircle className="w-8 h-8 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className={`text-lg font-semibold ${colors.title}`}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className={`p-4 ${colors.bg} ${colors.border} border-t border-b`}>
          <p className={`text-sm ${colors.message} whitespace-pre-wrap`}>
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 p-4">
          {showCancel && (
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleConfirm}
            className={`${showCancel ? "flex-1" : "w-full"} ${
              colors.button
            } text-white focus:ring-2 focus:ring-offset-2 transition-colors font-medium`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
