import { create } from "zustand";
/* ============== Types ============== */
export type FileStatus = "완료" | "실패" | "대기";
export type ContentType = "pdf" | "xls" | "jpg" | "dat" | string | null;

export type UploadedBy = {
  id: number;
  name: string;
  email: string;
};

export type UserInfo = {
  name: string;
  email: string;
  employeeId: string | number | null;
};

export type PageInfo = {
  page: number; // 현재 페이지 index (0-based)
  size: number; // 페이지 크기
  totalElements: number; // 현재 쿼리 기준 총 아이템 수
  totalPages: number; // 총 페이지 수
  hasNext: boolean;
  hasPrevious: boolean;
};

export type FilesMeta = {
  totalCount: number; // 전체 업로드 수
  totalSizeBytes: number; // 전체 용량
  monthlyCount: number; // 이번달 업로드 수
  page: PageInfo; // 페이징 정보
  files: AnyFileNode[];
};

// 공통 블록 ①: 그룹 관련 메타(파일에도 옵션으로 내려옴)
interface BaseGroupish {
  groupId: number | null;
  groupName: string | null;
  description: string | null;
  itemCount: number | null;
  totalGroupSizeBytes: number | null;
}

// 공통 블록 ②: 스토리지/파일 메타
interface BaseStorage {
  filename: string | null;
  contentType: ContentType;
  sizeBytes: number | null; // 각 모델에서 필요 시 number로 좁힐 것
  s3Key: string | null;
}

// 공통 블록 ③: 타임스탬프
interface BaseAudit {
  createdAt: string | null;
  uploadedAt: string | null; // 각 모델에서 필요 시 string으로 좁힐 것
  modifiedAt: string | null;
}

// 공통 블록 ④: 삭제 플래그(파일엔 null 가능)
interface BaseDeletionNullable {
  deleted: boolean | null;
}

// ───────────────────────────────────────────
// 개별 모델 (공통 블록을 조합 + 필요한 곳에서 더 좁힘)
// ───────────────────────────────────────────

// FileItem: 서버 응답 그대로 유지 (필드/이름 동일)
export type FileItem = BaseGroupish &
  BaseStorage &
  BaseAudit &
  BaseDeletionNullable & {
    id: number;
    sizeBytes: number;
    uploadedBy: UploadedBy | null;
    items: FileItem[] | null;
    status?: FileStatus; // 클라이언트 표시용(서버에는 없음)
  };

// GroupItem: 공통 블록을 재사용하되 더 엄격하게 좁힘
export type GroupItem = BaseGroupish &
  BaseStorage &
  BaseAudit & {
    id: number | null; // 그룹 아이디 (null 가능)
    groupId: number; // 그룹 식별자(필수)
    uploadedAt: string;
    deleted: boolean;
    itemCount: number;
    totalGroupSizeBytes: number;

    uploadedBy: UploadedBy; // 업로더 정보(필수)
    items: FileItem[]; // 파일 목록
  };

export type AnyFileNode = GroupItem | FileItem;
/* -------------------  실제 store 코드 ---------------- */

interface MyPageState {
  userInfo: UserInfo | null;
  meta: FilesMeta | null; // files의 메타(카운트/용량/페이징)

  setUserInfo: (userInfo: UserInfo) => void;
  setFilesInfo: (meta: FilesMeta) => void;
}

export const useMyPageStore = create<MyPageState>((set) => ({
  userInfo: null,
  meta: {
    totalCount: 0,
    totalSizeBytes: 0,
    monthlyCount: 0,
    page: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
    files: [],
  },

  setUserInfo: (userInfo) => set({ userInfo }),
  setFilesInfo: (meta) => set({ meta }),
}));
