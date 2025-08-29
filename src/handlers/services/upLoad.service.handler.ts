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
            try {
                if (type === "MULTI_PART" && Array.isArray(presignedUrl)) {
                    const multiPartResult = await uploadMultiPart(presignedUrl, file, id, type);
                    files.push(multiPartResult);
                    
                } else if (type === "SINGLE_PART" && typeof presignedUrl === "string") {
                    const singlePartResult = await uploadSinglePart(presignedUrl, file, id, type);
                    files.push(singlePartResult);
                }
            } catch (error) {
                console.error(`Upload failed for file ${file.name}:`, error);
                files.push({
                    id,
                    type: type,
                    etag: "",
                    status: "FAILED"
                });
            }
        })
    );
    
    return {
        sessionId: uploadDatas[0].sessionId,
        files: files
    };
};

const uploadSinglePart = async (presignedUrl: string, file: File, id: number, type: string) => {
    const res = await fetch(presignedUrl, {
        method: "PUT",
        headers: { 
            "Content-Type": file.type, 
            "Content-Length": file.size.toString() 
        },
        body: file,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
    }
    
    const eTag = res.headers.get("ETag")?.replace(/"/g, "");
    return {
        id,
        type: type,
        etag: eTag || "",
        status: eTag ? "SUCCESS" : "FAILED"
    };
}

const uploadMultiPart = async (presignedUrlArr: string[], file: File, id: number, type: string) => {
  const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
  const uploadPromises = presignedUrlArr.map(async (url, partIndex) => {
      const start = partIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`Part ${partIndex + 1}: bytes ${start}-${end} (${chunk.size} bytes)`);
      
      const res = await fetch(url, {
          method: "PUT",
          headers: { 
              "Content-Type": file.type,
              "Content-Length": chunk.size.toString()
          },
          body: chunk
      });
      
      if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Part ${partIndex + 1} upload failed: ${res.status} ${text}`);
      }
      
      const eTag = res.headers.get("ETag")?.replace(/"/g, "");
      console.log(`Part ${partIndex + 1} ETag: ${eTag}`);
      
      return { 
          partNumber: partIndex + 1, 
          etag: eTag || "" 
      };
  });
  
  const partResults = await Promise.all(uploadPromises);
  
  console.log('All part results:', partResults);
  
  return {
      id,
      type: type,
      multipartParts: partResults, // MultipartPartInfo[] 형태로 반환
      status: "SUCCESS"
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