import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type MessageType = "upload" | "download";
export type MessageStatus = "PROGRESS" | "SUCCESS" | "FAILED";
export type ProgressMessage = {
  id: number;
  sessionId: string;
  fileName: string;
  progress: number; // 0~100
  status: MessageStatus;
  error?: string;
  type: MessageType;
};

// 공통 필드 추상화
export type BaseProgress = {
  sessionId: string;
  type: MessageType;
  status: MessageStatus;
  progress: number; // 전체 건에 대한 진행률 (0~100)
  error?: string;
};

export type ProgressPerUpload = BaseProgress & {
  items: ProgressMessage[]; // 개별 파일들의 진행률
};

export type ProgressPerDownload = BaseProgress & {
  items: string[]; // 테이블에서 선택된 파일명 & 그룹명 목록
};

type CancelHandle = { cancel: () => void };

type TransferState = {
  uploads: ProgressPerUpload[]; // 업로드 건별 관리 (messages 제거)
  downloads: ProgressPerDownload[]; // 다운로드 건별 관리 (messages 제거)
  cardsVisible: boolean;
  uploadInProgress: number;
  downloadInProgress: number;
  inflight: Map<string, CancelHandle>;

  toggle: () => void;

  // -------uploads 기반 함수들-----------------------------------------
  addUpload: (sessionId: string) => void;
  addFile: (
    sessionId: string,
    status: MessageStatus,
    file: ProgressMessage
  ) => void;
  updateFileProgress: (
    id: number,
    sessionId: string,
    type: MessageType,
    progress: number
  ) => void;
  successFile: (id: number, sessionId: string, type: MessageType) => void;
  failFile: (
    id: number,
    sessionId: string,
    type: MessageType,
    status: MessageStatus,
    error?: string
  ) => void;
  completeUpload: (sessionId: string) => void;
  failUpload: (sessionId: string, error?: string) => void;

  cancelUpload: (sessionId: string) => void;
  clearFinished: () => void;
  // ---------------------------------------------------------------
  removeProgress: (sessionId: string, type: MessageType) => void;
  setCancelHandle: (
    id: number,
    sessionId: string,
    type: MessageType,
    handle: CancelHandle
  ) => void;
  cancel: (id: number, sessionId: string, type: MessageType) => void;

  // -------downloads 기반 함수들-----------------------------------------
  addDownload: (sessionId: string, selectedNames: selectedItems) => void;
  updateDownloadProgress: (sessionId: string, newProgress: number) => void;
  completeDownload: (sessionId: string) => void;
  failDownload: (sessionId: string, error?: string) => void;
  // ---------------------------------------------------------------
};

const key = (id: number, sessionId: string, type: MessageType) =>
  `${type}:${sessionId}:${id}`;

export const useFileTransferStore = create<TransferState>()(
  subscribeWithSelector((set, get) => ({
    uploads: [],
    downloads: [],
    cardsVisible: true,
    uploadInProgress: 0,
    downloadInProgress: 0,
    inflight: new Map(),

    toggle: () =>
      set((state) => ({
        cardsVisible: !state.cardsVisible,
      })),

    // 새 업로드 건 추가
    addUpload: (sessionId) =>
      set((state) => {
        const existingUpload = state.uploads.find(
          (u) => u.sessionId === sessionId
        );

        if (existingUpload) {
          return state;
        }

        const newUpload: ProgressPerUpload = {
          sessionId,
          type: "upload",
          status: "PROGRESS",
          progress: 0,
          items: [],
        };

        return { uploads: [...state.uploads, newUpload] };
      }),
    // 새 업로드 건 추가
    addDownload: (sessionId, selectedNames) =>
      set((state) => {
        const existingDownload = state.downloads.find(
          (u) => u.sessionId === sessionId
        );

        if (existingDownload) {
          return state;
        }

        const newDownload: ProgressPerDownload = {
          sessionId,
          type: "download",
          status: "PROGRESS",
          progress: 0,
          items: selectedNames,
        };

        return { downloads: [...state.downloads, newDownload] };
      }),

    // 업로드 건에 파일 추가
    addFile: (sessionId, status, file) =>
      set((state) => {
        const uploads = state.uploads.map((upload) => {
          if (upload.sessionId === sessionId) {
            // 이미 존재하는 파일인지 확인
            const existingFileIndex = upload.items.findIndex(
              (m) => m.id === file.id
            );

            const updatedItems =
              existingFileIndex === -1
                ? [...upload.items, file]
                : upload.items.map((m, idx) =>
                    idx === existingFileIndex ? { ...m, ...file } : m
                  );

            // 전체 진행률 재계산
            const completedCount = updatedItems.filter(
              (m) => m.status === "SUCCESS"
            ).length;
            const totalCount = updatedItems.length;
            const overallProgress =
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0;

            return {
              ...upload,
              items: updatedItems,
              progress: overallProgress,
            };
          }
          return upload;
        });

        return { uploads };
      }),

    // 개별 파일 진행률 업데이트
    updateFileProgress: (id, sessionId, type, progress) =>
      set((state) => {
        const idx = state.uploads.findIndex(
          (upload) => upload.sessionId === sessionId && upload.type === type
        );
        if (idx === -1) return {};
        const uploads = [...state.uploads];
        const upload = uploads[idx];
        const updatedItems = upload.items.map((m) =>
          m.id === id ? { ...m, progress } : m
        );
        uploads[idx] = {
          ...upload,
          items: updatedItems,
        };
        return { uploads };
      }),
    updateDownloadProgress: (sessionId, newProgress) =>
      set((state) => {
        const idx = state.downloads.findIndex((d) => d.sessionId === sessionId);
        if (idx === -1) return state;
        const downloads = [...state.downloads];
        // 원하는 필드만 변경
        downloads[idx] = {
          ...downloads[idx],
          // 예: progress만 바꾼다
          progress: newProgress,
          // 또는 messages 등 필요한 값만 변경
        };
        return { downloads };
      }),

    // 개별 파일 성공 처리
    successFile: (id, sessionId) =>
      set((state) => {
        const uploads = state.uploads.map((upload) => {
          if (upload.sessionId === sessionId) {
            const updatedItems = upload.items.map((m) =>
              m.id === id
                ? {
                    ...m,
                    progress: 100,
                    status: "SUCCESS" as MessageStatus,
                    error: undefined,
                  }
                : m
            );

            // 전체 진행률 재계산 (개별 파일이 성공 처리 될때마다 업데이트)
            const completedCount = updatedItems.filter(
              (m) => m.status === "SUCCESS"
            ).length;
            const totalCount = updatedItems.length;
            const overallProgress = Math.round(
              (completedCount / totalCount) * 100
            );

            return {
              ...upload,
              items: updatedItems,
              progress: overallProgress,
            };
          }
          return upload;
        });

        return { uploads };
      }),

    // 개별 파일 실패 처리
    failFile: (id, sessionId, error) =>
      set((state) => {
        const uploads = state.uploads.map((upload) => {
          if (upload.sessionId === sessionId) {
            const updatedItems = upload.items.map((m) =>
              m.id === id
                ? {
                    ...m,
                    status: "FAILED" as MessageStatus,
                    error: error ?? "실패",
                  }
                : m
            );

            return {
              ...upload,
              items: updatedItems,
            };
          }
          return upload;
        });

        return { uploads };
      }),

    // SUCCESS 나 FAILED 상태인 업로드/ 다운로드 제거
    removeProgress: (sessionId, type) =>
      set((state) => {
        if (type === "upload") {
          return {
            uploads: state.uploads.filter(
              (u) =>
                !(
                  u.sessionId === sessionId &&
                  u.type === "upload" &&
                  (u.status === "SUCCESS" || u.status === "FAILED")
                )
            ),
          };
        } else if (type === "download") {
          return {
            downloads: state.downloads.filter(
              (u) =>
                !(
                  u.sessionId === sessionId &&
                  u.type === "download" &&
                  (u.status === "SUCCESS" || u.status === "FAILED")
                )
            ),
          };
        }
        return {};
      }),

    // 진행중인 건 취소
    cancelUpload: (sessionId) => {
      const upload = get().uploads.find(
        (u) => u.sessionId === sessionId && u.type === "upload"
      );
      if (upload) {
        upload.items.forEach((msg) => {
          get().cancel(msg.id, sessionId, "upload");
          //TODO : abort 메서드 호출도 함께 필요
        });
      }
    },

    // 완료된 업로드 건들 정리
    clearFinished: () =>
      set((state) => ({
        uploads: state.uploads.filter((u) => u.status === "PROGRESS"),
      })),

    setCancelHandle: (id, sessionId, type, handle) =>
      set((state) => {
        const next = new Map(state.inflight);
        next.set(key(id, sessionId, type), handle);
        return { inflight: next };
      }),

    cancel: (id, sessionId, type) => {
      const h = get().inflight.get(key(id, sessionId, type));
      if (h) {
        try {
          h.cancel();
        } catch {
          // TODO : 취소에러 처리
        }
        set((state) => {
          const next = new Map(state.inflight);
          next.delete(key(id, sessionId, type));
          return { inflight: next };
        });
      }
    },

    // 업로드 건 완료 (fetchUploadComplete 성공 시)
    completeUpload: (sessionId) =>
      set((state) => ({
        uploads: state.uploads.map((upload) =>
          upload.sessionId === sessionId
            ? { ...upload, status: "SUCCESS", progress: 100 }
            : upload
        ),
      })),
    // 다운로드 건 완료 (fetchDownloadComplete 성공 시)
    completeDownload: (sessionId) =>
      set((state) => ({
        downloads: state.downloads.map((download) =>
          download.sessionId === sessionId
            ? { ...download, status: "SUCCESS", progress: 100 }
            : download
        ),
      })),
    // 업로드 건 실패
    failUpload: (sessionId, error) =>
      set((state) => ({
        uploads: state.uploads.map((upload) =>
          upload.sessionId === sessionId
            ? { ...upload, status: "FAILED", error: error ?? "업로드 실패" }
            : upload
        ),
      })),
    //다운로드 건 실패
    failDownload: (sessionId, error) =>
      set((state) => ({
        downloads: state.downloads.map((download) =>
          download.sessionId === sessionId
            ? { ...download, status: "FAILED", error: error ?? "다운로드 실패" }
            : download
        ),
      })),
  }))
);
