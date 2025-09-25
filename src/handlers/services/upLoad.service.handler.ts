import { API_CONFIG, UPLOAD } from '@/config/api.config';
import type { FileInfo, UploadCompleteData, UploadData, UploadFileData } from '@/components/uploads/UploadButton';
import type { FileEditInfo } from '@/components/edits/EditButton';
import { useFileTransferStore } from '@/stores/useFileTransferStore';


// FileMetadataOnlyUpdateRequest 형식에 맞게 수정
export const fetchEdit = async (files: FileEditInfo[], type: string): Promise<any[]> => {
    try {
        if (type === "GROUP") {
            // 그룹 파일 수정 - 모든 파일을 한 번에 전송
            const groupId = files[0]?.groupId;
            if (!groupId) {
                throw new Error('그룹 ID가 없습니다.');
            }

            const requestBody = {
                uploadType: "GROUP",
                groupFileUpdateRequest: {
                    groupId: groupId,
                    groupName: files[0]?.groupName || "기본 그룹명",
                    groupDescription: files[0]?.groupDescription || "기본 그룹 설명",
                    filesToUpdate: files.map(file => ({
                        fileId: file.fileId,
                        metadata: {
                            description: file.description || '',
                            vehicle: file.vehicle || '',
                            testResult: file.testResult || '',
                            ptType: file.ptType || '',
                            ecu: file.ecu || '',
                            devType: file.devType || '',
                            testClassification: file.testClassification || '',
                            devStep: file.devStep || '',
                            testItem: file.testItem || '',
                            tcNum: file.tcNum || '',
                            swVer: file.swVer || '',
                            deliverableType: file.deliverableType || '',
                            customMetadata: file.customMetadata || {}
                        }
                    }))
                }
            };

            console.log('그룹 파일 수정 요청 데이터:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.edit}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            console.log('그룹 파일 수정 응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('그룹 파일 수정 에러 응답:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('그룹 파일 수정 성공 응답:', data);
            return [data]; // 그룹 수정은 단일 응답을 배열로 감싸서 반환
        } else {
            // 개별 파일 수정 - 각 파일을 개별적으로 처리 (IndividualFileUpdateRequest는 단일 파일만 지원)
            const results = [];
            for (const file of files) {
                try {
                    const metadata = {
                        id: file.fileId,
                        name: file.name,
                        fileSize: file.fileSize > 0 ? file.fileSize : 1024,
                        fileExtension: file.fileExtension || '',
                        mimeType: file.mimeType || 'text/plain',
                        description: file.description || '',
                        vehicle: file.vehicle || '',
                        testResult: file.testResult || '',
                        ptType: file.ptType || '',
                        ecu: file.ecu || '',
                        devType: file.devType || '',
                        testClassification: file.testClassification || '',
                        devStep: file.devStep || '',
                        testItem: file.testItem || '',
                        tcNum: file.tcNum || '',
                        swVer: file.swVer || '',
                        deliverableType: file.deliverableType || '',
                        customMetadata: file.customMetadata || {},
                        createdAt: new Date().toISOString()
                    };

                    const requestBody = {
                        uploadType: "INDIVIDUAL",
                        individualFileUpdateRequest: {
                            fileId: file.fileId,
                            fileToUpdate: {
                                fileId: file.fileId,
                                metadata: metadata
                            }
                        }
                    };

                    console.log('개별 파일 수정 요청 데이터:', JSON.stringify(requestBody, null, 2));

                    const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.edit}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: 'include',
                        body: JSON.stringify(requestBody)
                    });

                    console.log('개별 파일 수정 응답 상태:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('개별 파일 수정 에러 응답:', errorText);
                        throw new Error(`HTTP ${response.status}: ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('개별 파일 수정 성공 응답:', data);
                    results.push(data);
                } catch (error) {
                    console.error(`파일 ${file.name} 업데이트 실패:`, error);
                    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
                    results.push({ error: errorMessage });
                }
            }
            return results;
        }
    } catch (error) {
        console.error('파일 수정 실패:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return [{ error: errorMessage }];
    }
}

export const fetchGroupEdit = async (files: FileEditInfo[], groupId: number, groupName?: string, groupDescription?: string): Promise<any> => {
    try {
        // 새 파일 추가용 FileAddToGroupRequest DTO에 맞는 요청 구조
        const requestBody = {
            groupId: groupId,
            groupName: groupName || "기본 그룹명",
            groupDescription: groupDescription || "기본 그룹 설명",
            filesToAdd: files.map(file => ({
                name: file.name,
                fileSize: file.fileSize > 0 ? file.fileSize : 1024,
                fileExtension: file.fileExtension || '',
                description: file.description || '',
                vehicle: file.vehicle || '',
                testResult: file.testResult || '',
                ptType: file.ptType || '',
                ecu: file.ecu || '',
                devType: file.devType || '',
                testClassification: file.testClassification || '',
                devStep: file.devStep || '',
                testItem: file.testItem || '',
                tcNum: file.tcNum || '',
                swVer: file.swVer || '',
                deliverableType: file.deliverableType || '',
                customMetadata: file.customMetadata || {}
            }))
        };

        console.log('그룹 파일 추가 요청 데이터:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.groupEdit}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        console.log('그룹 편집 응답 상태:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('그룹 편집 에러 응답:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('그룹 편집 성공 응답:', data);
        return data;
    } catch (error) {
        console.error('그룹 편집 실패:', error);
        throw error;
    }
}


export const fetchGroupComplete = async (sessionId: string, files: FileEditInfo[]): Promise<any> => {
    try {
        console.log('fetchGroupComplete 호출 - sessionId:', sessionId);
        console.log('fetchGroupComplete 호출 - files:', files);
        
        if (!sessionId) {
            throw new Error('sessionId가 없습니다.');
        }
        
        // FileAddToGroupCompleteRequest DTO에 맞는 요청 구조
        const requestBody = {
            sessionId: sessionId,
            newFiles: files.map((file, index) => {
                const uploadStrategy = file.fileSize > 100 * 1024 * 1024 ? "MULTI_PART" : "SINGLE_PART";
                const baseFile = {
                    fileIndex: index,
                    uploadStrategy: uploadStrategy,
                    status: "SUCCESS",
                    errorMessage: null
                };
                // SINGLE_PART인 경우 etag만 포함
                if (uploadStrategy === "SINGLE_PART") {
                    return {
                        ...baseFile,
                        etag: file.etag || "",
                        multipartParts: null
                    };
                } 
                // MULTI_PART인 경우 multipartParts 포함
                else {
                    return {
                        ...baseFile,
                        etag: null,
                        multipartParts: file.multipartParts || []
                    };
                }
            })
        };

        console.log('그룹 완료 요청 데이터:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.groupComplete}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        console.log('그룹 완료 응답 상태:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('그룹 완료 에러 응답:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('그룹 완료 성공 응답:', data);
        return data;
    } catch (error) {
        console.error('그룹 완료 실패:', error);
        throw error;
    }
}

/**
 *
 * @returns
 */
export const fetchInitUpload = async (
  files: FileInfo[],
  type: string
): Promise<UploadData[]> => {
  const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.init}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      type: type,
      files: files,
    }),
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
        file: files[count++].file,
      };
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
export const fetchUpload = async (
  uploadDatas: UploadData[]
): Promise<UploadCompleteData> => {
  const files: UploadFileData[] = [];
  await Promise.all(
    uploadDatas.map(async ({ id, presignedUrl, file, type }) => {
      try {
        if (type === "MULTI_PART" && Array.isArray(presignedUrl)) {
          const multiPartResult = await uploadMultiPart(
            presignedUrl,
            file,
            id,
            type
          );
          files.push(multiPartResult);
        } else if (type === "SINGLE_PART" && typeof presignedUrl === "string") {
          const singlePartResult = await uploadSinglePart(
            presignedUrl,
            file,
            id,
            type
          );
          files.push(singlePartResult);
        }
      } catch (error) {
        console.error(`Upload failed for file ${file.name}:`, error);
        files.push({
          id,
          type: type,
          etag: "",
          status: "FAILED",
        });
      }
    })
  );

  return {
    sessionId: uploadDatas[0].sessionId,
    files: files,
  };
};

const uploadSinglePart = async (
  presignedUrl: string,
  file: File,
  id: number,
  type: string
) => {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Content-Length": file.size.toString(),
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
    status: eTag ? "SUCCESS" : "FAILED",
  };
};

const uploadMultiPart = async (
  presignedUrlArr: string[],
  file: File,
  id: number,
  type: string
) => {
  const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
  const uploadPromises = presignedUrlArr.map(async (url, partIndex) => {
    const start = partIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    console.log(
      `Part ${partIndex + 1}: bytes ${start}-${end} (${chunk.size} bytes)`
    );

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": chunk.size.toString(),
      },
      body: chunk,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Part ${partIndex + 1} upload failed: ${res.status} ${text}`
      );
    }

    const eTag = res.headers.get("ETag")?.replace(/"/g, "");
    console.log(`Part ${partIndex + 1} ETag: ${eTag}`);

    return {
      partNumber: partIndex + 1,
      etag: eTag || "",
    };
  });

  const partResults = await Promise.all(uploadPromises);

  console.log("All part results:", partResults);

  return {
    id,
    type: type,
    multipartParts: partResults, // MultipartPartInfo[] 형태로 반환
    status: "SUCCESS",
  };
};

/**
 *
 * @param uploadDatas
 * @param sessionId
 * @returns
 */
export const fetchUploadComplete = async (
  uploadCompleteData: UploadCompleteData
): Promise<UploadCompleteData> => {
  // 실제 업로드 결과에서 실패한 파일들 확인
  const hasFailedFiles = useFileTransferStore
    .getState()
    .uploads.filter(
      (upload) => upload.sessionId === uploadCompleteData.sessionId
    )
    .some((upload) => upload.items.some((items) => items.status === "FAILED"));

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${UPLOAD.complete}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sessionId: uploadCompleteData.sessionId,
        files: uploadCompleteData.files,
      }),
    });
    if (!response.ok) {
      useFileTransferStore.getState().failUpload(uploadCompleteData.sessionId);
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      // 실패 응답 구조: { success: false, status: number, code: string, message: string }
      const errorMessage =
        result.message || "업로드 완료 처리 중 알 수 없는 오류 발생";
      const errorCode = result.code ? `[${result.code}] ` : "";
      const statusInfo = result.status ? ` (Status: ${result.status})` : "";
      useFileTransferStore.getState().failUpload(uploadCompleteData.sessionId);
      throw new Error(`${errorCode}${errorMessage}${statusInfo}`);
    }

    // 성공 응답 구조: { success: true, data: T, message: string }
    console.log("업로드 완료 처리 성공:", result.message);
    if (hasFailedFiles) {
      useFileTransferStore.getState().failUpload(uploadCompleteData.sessionId);
    } else {
      useFileTransferStore
        .getState()
        .completeUpload(uploadCompleteData.sessionId);
    }
    return result.data || [];
  } catch (error) {
    useFileTransferStore.getState().failUpload(uploadCompleteData.sessionId);
    console.error("fetchUploadComplete 에러:", error);
    throw error;
  }
};
//--- Progress 반영 버전 ----
/**
 * 실시간 진행률 업데이트가 포함된 XHR 업로드
 * @param uploadDatas - 업로드할 데이터 배열
 * @returns Promise<UploadCompleteData>
 */
export const XHRProgressUpload = async (
  uploadDatas: UploadData[]
): Promise<UploadCompleteData> => {
  const files: UploadFileData[] = [];

  // 업로드 건을 스토어에 추가 (세션별)
  const sessionId = uploadDatas[0].sessionId; // 모든 파일이 같은 세션
  useFileTransferStore.getState().addUpload(sessionId);

  // 각 파일을 업로드 건에 추가하고 진행률 0으로 초기화
  uploadDatas.forEach(({ sessionId, id, file }) => {
    useFileTransferStore.getState().addFile(sessionId, "PROGRESS", {
      id: id,
      sessionId: sessionId,
      type: "upload",
      status: "PROGRESS",
      progress: 0,
      fileName: file.name,
    });
  });

  await Promise.all(
    uploadDatas.map(async ({ sessionId, id, presignedUrl, file, type }) => {
      try {
        // TODO 진행률 업데이트 콜백 함수 차후 Throttle 적용 고려
        const onProgress = (progress: number) => {
          useFileTransferStore
            .getState()
            .updateFileProgress(id, sessionId, "upload", progress);
        };

        if (type === "MULTI_PART" && Array.isArray(presignedUrl)) {
          const multiPartResult = await uploadMultiPartXhr(
            presignedUrl,
            file,
            id,
            sessionId,
            type,
            onProgress
          );
          files.push(multiPartResult);

          // 성공 시 스토어 업데이트
          useFileTransferStore.getState().successFile(id, sessionId, "upload");
        } else if (type === "SINGLE_PART" && typeof presignedUrl === "string") {
          const singlePartResult = await uploadSinglePartXhr(
            presignedUrl,
            file,
            id,
            sessionId,
            type,
            onProgress
          );
          files.push(singlePartResult);

          // 성공 시 스토어 업데이트
          useFileTransferStore.getState().successFile(id, sessionId, "upload");
        }
      } catch (error) {
        console.error(`Upload failed for file ${file.name}:`, error);

        // 실패 시 스토어 업데이트
        useFileTransferStore
          .getState()
          .failFile(
            id,
            sessionId,
            "upload",
            "FAILED",
            error instanceof Error ? error.message : "업로드 실패"
          );

        files.push({
          id,
          type: type,
          etag: "",
          status: "FAILED",
        });
      }
    })
  );

  return {
    sessionId: uploadDatas[0].sessionId,
    files: files,
  };
};

const uploadSinglePartXhr = async (
  presignedUrl: string,
  file: File,
  id: number,
  sessionId: string,
  type: string,
  onProgress?: (progress: number) => void
): Promise<UploadFileData> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);

    // 취소 핸들러 등록
    useFileTransferStore.getState().setCancelHandle(id, sessionId, "upload", {
      cancel: () => {
        xhr.abort();
        reject(new Error("Upload cancelled by user"));
      },
    });

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const eTag = xhr.getResponseHeader("ETag")?.replace(/"/g, "");
        resolve({
          id,
          type: type,
          etag: eTag || "",
          status: eTag ? "SUCCESS" : "FAILED",
        });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    xhr.send(file);
  });
};

const uploadMultiPartXhr = async (
  presignedUrlArr: string[],
  file: File,
  id: number,
  _sessionId: string, // 향후 multipart 취소 핸들러에서 사용 예정
  type: string,
  onProgress?: (progress: number) => void
) => {
  const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
  const totalParts = presignedUrlArr.length;
  let completedParts = 0;

  function uploadPartWithXHR(
    presignedUrl: string,
    chunk: Blob,
    _partIndex: number,
    contentType?: string
  ): Promise<{ etag: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      if (contentType) {
        xhr.setRequestHeader("Content-Type", contentType);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          // 전체 진행률 = (완료된 파트 수 + 현재 파트 진행률) / 전체 파트 수 * 100
          const currentPartPercent = e.loaded / e.total;
          const totalPercent = Math.round(
            ((completedParts + currentPartPercent) / totalParts) * 100
          );

          if (onProgress) {
            onProgress(totalPercent);
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const eTag = xhr.getResponseHeader("ETag")?.replace(/"/g, "");
          // 파트 완료 시 카운트 증가
          completedParts++;
          resolve({
            etag: eTag || "",
          });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onabort = () => reject(new Error("Network error"));

      xhr.send(chunk);
    });
  }
  const uploadPromises = presignedUrlArr.map(async (url, partIndex) => {
    const start = partIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    console.log(
      `Part ${partIndex + 1}: bytes ${start}-${end} (${chunk.size} bytes)`
    );

    try {
      const { etag } = await uploadPartWithXHR(
        url,
        chunk,
        partIndex,
        file.type
      );
      console.log(`Part ${partIndex + 1} ETag: ${etag}`);

      return {
        partNumber: partIndex + 1,
        etag,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Part ${partIndex + 1} upload failed: ${msg}`);
    }
  });

  const partResults = await Promise.all(uploadPromises);
  console.log("All part results:", partResults);

  return {
    id,
    type,
    multipartParts: partResults, // MultipartPartInfo[] 형태로 반환
    status: "SUCCESS",
  };
};
