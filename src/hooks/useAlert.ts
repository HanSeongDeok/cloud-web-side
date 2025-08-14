import { useState, useCallback } from "react";
import type { AlertType } from "@/components/ui/AlertModal";

interface AlertConfig {
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
}

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = useCallback((alertConfig: AlertConfig) => {
    setConfig(alertConfig);
    setIsOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 편의 메서드들
  const showSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        type: "success",
        title,
        message,
        onConfirm,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        type: "error",
        title,
        message,
        onConfirm,
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        type: "warning",
        title,
        message,
        onConfirm,
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        type: "info",
        title,
        message,
        onConfirm,
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      type: AlertType = "warning"
    ) => {
      showAlert({
        type,
        title,
        message,
        onConfirm,
        showCancel: true,
        confirmText: "확인",
        cancelText: "취소",
      });
    },
    [showAlert]
  );

  return {
    isOpen,
    config,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};
