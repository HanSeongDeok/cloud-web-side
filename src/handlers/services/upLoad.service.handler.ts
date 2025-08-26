import { API_CONFIG, UPLOAD } from '@/api/api.config';
import type { FileInfo, UploadCompleteData, UploadData, UploadFileData } from '@/components/UploadButton';

/**
 * 
 * @returns 
 */
export const fetchInitUpload = async (files: FileInfo[], type: string): Promise<UploadData[]> => {
    const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.init}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            type: type,
            files: files
        })
    });

    const data = await response.json();

    if (response.ok) {
        let count = 0;
        const uploadData = data.data.files.map((file: any) => {
            return {
                sessionId: data.data.sessionId,
                id: file.id,
                presignedUrl: file.presignedUrl,
                type: file.type,
                file: files[count++].file
            }
        });
        return uploadData;
    }
    return data;
};

/**
 * 
 * @param presignedUrl 
 * @param file 
 * @returns 
 */
export const fetchUpload = async (uploadDatas: UploadData[]): Promise<UploadCompleteData> => {
    const files: UploadFileData[] = [];
    await Promise.all(
    uploadDatas.map(async ({ id, presignedUrl, file, type }) => {
      const res = await fetch(presignedUrl, {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": file.type, "Content-Length": file.size.toString() },
        body: file,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
      }
      const eTag = res.headers.get("ETag")?.replace(/"/g, "");
      files.push({
        id,
        type: type,
        etag: eTag || "",
        status: eTag ? "SUCCESS" : "FAILED"
      });
    })
  );
  return {
    sessionId: uploadDatas[0].sessionId,
    files: files
  };
};

/**
 * 
 * @param uploadDatas 
 * @param sessionId 
 * @returns 
 */
export const fetchUploadComplete = async (uploadCompleteData: UploadCompleteData): Promise<UploadCompleteData> => {
    const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.complete}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            sessionId: uploadCompleteData.sessionId,
            files: uploadCompleteData.files
        })
    });

    const data = await response.json();
    return data;
}