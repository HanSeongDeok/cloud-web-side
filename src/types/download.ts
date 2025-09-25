export type downLoadType = "COMPRESSED" | "UNCOMPRESSED";

export type DownLoadRequest = {
  type: downLoadType;
  fileIds?: number[];
  folderIds?: number[];
};

export type DownloadInfo = {
  sessionId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresInSeconds: number;
};
