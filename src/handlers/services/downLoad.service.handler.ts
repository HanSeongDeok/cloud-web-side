import { API_CONFIG, DOWNLOAD } from "@/config/api.config";
import { useFileTransferStore } from "@/stores/useFileTransferStore";
import type { DownLoadRequest, DownloadInfo } from "@/types/download";
import { makeKey } from "../events/file.download.handler";
import { el } from "date-fns/locale";

/**
 * 선택한 파일에 대해 다운로드 URL을 받아옵니다
 * @param downloadInfo - 다운로드할 파일/폴더 정보
 * @returns Promise<DownloadInfo>
 */
export const fetchInitDownload = async (
  downloadRequest: DownLoadRequest,
  selectedNames: string[]
): Promise<DownloadInfo> => {
  const key = makeKey(
    downloadRequest.fileIds || [],
    downloadRequest.folderIds || []
  );
  const sessionId = `${Date.now()}-${key}`;
  console.log("sessionId:", sessionId);
  useFileTransferStore.getState().addDownload(sessionId, selectedNames);
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${DOWNLOAD.download}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(downloadRequest),
    });
    const data = await response.json();

    if (response.ok && data.success) {
      data.data.sessionId = sessionId;
      return data.data;
    } else {
      useFileTransferStore.getState().failDownload(sessionId, data.message);
      throw new Error(data.message || "다운로드 url 요청에 실패했습니다");
    }
  } catch (error: any) {
    useFileTransferStore.getState().failDownload(sessionId, error.message);
    throw new Error(error.message || "다운로드 url 요청에 실패했습니다");
  }
};

/**
 * 선택한 파일에 대해 다운로드 URL을 받아옵니다
 * @param downloadInfo - 다운로드할 파일/폴더 정보
 * @returns Promise<DownloadResponse>
 */
export const fetchDownload = async (info: DownloadInfo) => {
  const sessionId = info.sessionId; // 모든 파일이 같은 세션
  const presignedUrl = info.downloadUrl;
  try {
    const response = await fetch(presignedUrl);

    if (!response.ok || !response.body) throw new Error("다운로드 실패");
    const contentLength = Number(response.headers.get("content-length"));
    const reader = response.body.getReader();
    let received = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      useFileTransferStore
        .getState()
        .updateDownloadProgress(
          sessionId,
          contentLength ? Math.round((received / contentLength) * 100) : 0
        );
    }
    // 다운로드 완료: blob 생성 후 다운로드
    const blob = new Blob(chunks);
    const urlObj = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    // 실제 S3 오브젝트 파일명으로 다운로드
    a.download = info.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlObj);
    useFileTransferStore.getState().completeDownload(sessionId);
  } catch (error: any) {
    useFileTransferStore.getState().failDownload(sessionId, error.message);
    throw new Error(error.message || "다운로드에 실패했습니다");
  }
};
