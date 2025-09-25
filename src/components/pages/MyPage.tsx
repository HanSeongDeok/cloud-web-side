import { Folder } from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useEffect } from "react";
import {
  useMyPageStore,
  type AnyFileNode,
  type FileItem,
  type FilesMeta,
  type GroupItem,
} from "@/stores/useMyPageStore";
import { API_CONFIG, MY_PAGE } from "@/config/api.config";

/* 유틸: 파일 크기 포맷 (bytes → KB/MB/GB; 1000 단위) */
const formatBytes1000 = (bytes?: number | null): string => {
  const b = typeof bytes === "number" ? bytes : 0;
  if (b === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(1000));
  const value = b / Math.pow(1000, i);
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[i]}`;
};
/* 각 파일형식에 맞는 아이콘 출력 */
const FileBadge = ({ contentType }: { contentType: string | null }) => {
  const ct = (contentType ?? "").toLowerCase();
  const color =
    ct === "pdf"
      ? "bg-red-100 text-red-700"
      : ct === "xls" || ct === "xlsx"
      ? "bg-green-100 text-green-700"
      : ct === "jpg" || ct === "jpeg" || ct === "png"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[40px] h-7 px-2 rounded-md text-xs font-semibold ${color}`}
    >
      {contentType ?? "FILE"}
    </span>
  );
};

/* 각 파일의 status에 맞는 pill 출력 */
const StatusPill = ({ status = "완료" }: { status?: string }) => {
  const style =
    status === "완료"
      ? "bg-emerald-100 text-emerald-700"
      : status === "실패"
      ? "bg-rose-100 text-rose-700"
      : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`px-3 h-7 inline-flex items-center rounded-full text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
};

/* 파일일 경우 row 출력*/
const FileRow = ({ f }: { f: FileItem }) => {
  return (
    <div className="flex items-center justify-between h-[60px] rounded-xl border border-black/5 bg-white">
      <div className="flex items-center gap-3 pl-4">
        <FileBadge contentType={f.contentType} />
        <div className="flex flex-col">
          <span className="text-[15px] font-medium text-gray-800">
            {f.filename ?? "(이름 없음)"}
          </span>
          <span className="text-xs text-gray-500">
            {formatBytes1000(f.sizeBytes)} • {f.createdAt ?? ""}
          </span>
        </div>
      </div>
      <div className="pr-4">
        <StatusPill status={f.status} />
      </div>
    </div>
  );
}; // 타입가드: GroupItem 판별 (items가 배열이면 그룹)
const isGroupItem = (n: AnyFileNode): n is GroupItem =>
  Array.isArray((n as FileItem)?.items);

type UploadHistoryProps = {
  title?: string;
  onPageChange?: (newPage: number) => void; // 0-based page
};

function UploadHistory({
  title = "업로드 기록",
  onPageChange,
}: UploadHistoryProps) {
  const meta = useMyPageStore((s) => s.meta as FilesMeta | undefined);
  const pageInfo = meta?.page; // PageInfo
  const nodes = meta?.files ?? [];

  // 입력 박스는 1-based로 보여주므로 로컬 상태를 가짐
  const [pageInput, setPageInput] = React.useState<number>(() =>
    pageInfo ? pageInfo.page + 1 : 1
  );

  // pageInfo가 바뀌면 입력 값도 동기화
  React.useEffect(() => {
    if (pageInfo) setPageInput(pageInfo.page + 1);
  }, [pageInfo]);

  // 페이지 이동 핸들러(검증 포함)
  const goPage = React.useCallback(
    (p0: number) => {
      if (!pageInfo || !onPageChange) return;
      const safe = Math.max(0, Math.min(p0, pageInfo.totalPages - 1));
      if (safe !== pageInfo.page) onPageChange(safe);
    },
    [pageInfo, onPageChange]
  );

  return (
    <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.10)] p-[31px] w-full max-w-[960px]">
      {/* 헤더: 타이틀(좌) / 페이지네이션(우) */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold mb-5">{title}</h2>

        {/* 오른쪽 상단 페이지네이션 */}
        {pageInfo && (
          <div className="mb-5 flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-40"
              onClick={() => goPage(pageInfo.page - 1)}
              disabled={!pageInfo.hasPrevious}
              aria-label="이전 페이지"
            >
              ◀
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="number"
                className="w-14 h-8 rounded border border-gray-300 text-center"
                value={pageInput}
                onChange={(e) => setPageInput(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // 1-based → 0-based
                    const target = (Number(pageInput) || 1) - 1;
                    goPage(target);
                  }
                }}
                min={1}
                max={Math.max(1, pageInfo.totalPages)}
              />
              <span>/ {pageInfo.totalPages}</span>
            </div>

            <button
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-40"
              onClick={() => goPage(pageInfo.page + 1)}
              disabled={!pageInfo.hasNext}
              aria-label="다음 페이지"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* 목록 */}
      {nodes.length === 0 ? (
        <div className="text-sm text-gray-500">표시할 파일이 없습니다.</div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {nodes.map((n, idx) => {
            // 그룹
            if (isGroupItem(n)) {
              const groupTitle =
                n.groupName ??
                n.filename ??
                (n.groupId != null ? `그룹 #${n.groupId}` : "그룹");
              const totalBytes =
                n.totalGroupSizeBytes ??
                n.items.reduce((s, f) => s + (f.sizeBytes ?? 0), 0);
              const badge = `${
                n.itemCount ?? n.items.length
              }개 • ${formatBytes1000(totalBytes)}`;

              return (
                <AccordionItem
                  key={`n-${idx}`}
                  value={`n-${idx}`}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={[
                      "rounded-xl h-[56px] px-4",
                      "bg-white border border-black/10",
                      "data-[state=open]:bg-sky-50 data-[state=open]:border-sky-300",
                      "data-[state=open]:shadow-[0_0_0_1px_rgba(14,165,233,0.25)]",
                      "[&>svg]:hidden",
                      "text-left no-underline hover:no-underline",
                      "flex items-center justify-between",
                      "transition-all duration-200",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6">
                        <Folder className="text-gray-500" />
                      </span>
                      <span className="text-[15px] font-medium text-gray-800">
                        {groupTitle}
                      </span>
                    </div>
                    <span className="text-xs text-gray-700 bg-white border border-sky-100 rounded-full px-2.5 h-7 inline-flex items-center">
                      {badge}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pt-3">
                    <div className="ml-[10px] space-y-2">
                      {n.items.length === 0 ? (
                        <div className="text-xs text-gray-500 py-2">
                          파일이 없습니다.
                        </div>
                      ) : (
                        n.items.map((f, i) => (
                          <FileRow key={`n-${idx}-f-${i}`} f={f} />
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }

            // 파일
            return <FileRow key={`n-${idx}`} f={n as FileItem} />;
          })}
        </Accordion>
      )}
    </div>
  );
}

/**
 * 마이페이지 최상위 카드 컨테이너
 */
type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};
const StatCard = ({ value, label, className = "" }: StatCardProps) => {
  return (
    <div
      className={[
        "w-[270px] h-[141px]",
        "bg-white/95 rounded-[15px] p-[25px]",
        "flex flex-col items-center justify-center gap-3",
        "shadow-[0_5px_15px_rgba(0,0,0,0.10)]",
        className,
      ].join(" ")}
    >
      <div className="text-4xl font-semibold leading-none text-blue-600">
        {value}
      </div>
      <div className="text-sm font-normal text-gray-400">{label}</div>
    </div>
  );
};
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  const value = bytes / Math.pow(1000, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
};

const StateCardContainer = () => {
  const filesInfo = useMyPageStore((state) => state.meta);

  return (
    <div className="w-[900px] h-[141px] flex items-center justify-between">
      <StatCard
        value={String(filesInfo?.totalCount ?? 0)}
        label="총 업로드 개수"
      />
      <StatCard
        value={formatBytes(filesInfo?.totalSizeBytes ?? 0)}
        label="총 업로드 용량"
      />
      <StatCard
        value={String(filesInfo?.monthlyCount ?? 0)}
        label="이번달 업로드 개수"
      />
    </div>
  );
};

/**
 * 개인 정보 컨테이너
 */
type PersonalInfoCardProps = {
  title?: string;
  className?: string;
  hideEmpty?: boolean;
  labelMap?: Partial<Record<string, string>>;
};
const DEFAULT_LABELS: Record<string, string> = {
  name: "이름",
  email: "이메일",
  employeeId: "사번",
};
const PersonalInfoCard = ({
  title = "개인정보",
  className = "",
  hideEmpty = false,
  labelMap = {},
}: PersonalInfoCardProps) => {
  const userInfo = useMyPageStore((state) => state.userInfo);

  const entries = React.useMemo(() => {
    if (!userInfo) return [];
    return Object.entries(userInfo).filter(([_, v]) =>
      hideEmpty
        ? v !== null && v !== undefined && String(v).trim() !== ""
        : true
    );
  }, [userInfo, hideEmpty]);

  return (
    <div
      className={[
        "w-[954px]",
        "bg-white/95 backdrop-blur-[10px]",
        "rounded-[20px] p-[31px]",
        "border border-white/20",
        "shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
        "flex flex-col",
        "m-[50px]",
        className,
      ].join(" ")}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-extrabold">{title}</h2>
        </div>
      </div>

      {/* 구분선과 정보 목록 */}
      {userInfo && (
        <div className="mt-6 flex-1">
          {entries.map(([key, value], i) => (
            <div
              key={i}
              className="flex py-8 items-center justify-between h-[50px] border-b border-gray-400/20 last:border-b-0"
            >
              <span className="text-[16px] font-semibold text-gray-700">
                {labelMap[key] ?? DEFAULT_LABELS[key] ?? key}
              </span>
              <span className="text-sm text-gray-700">
                {value === null || value === undefined ? "" : String(value)}
              </span>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-sm text-gray-500 py-6">
              표시할 항목이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * MyPage 전체 컨테이너
 */

const MyPage: React.FC = () => {
  const setUserInfo = useMyPageStore((state) => state.setUserInfo);
  const setFilesInfo = useMyPageStore((state) => state.setFilesInfo);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${MY_PAGE.data}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn(e);
    }
  };

  const getUserInfo = async () => {
    try {
      const data = await fetchUserData();
      if (data) {
        // console.log(data);
        console.log(data);
        const userInfo = data.userInfo;
        const filesInfo = data.files;
        setUserInfo(userInfo);
        setFilesInfo(filesInfo);
      }
    } catch (error) {
      console.error("Failed to fetch search data:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  });

  return (
    <>
      <main className="min-h-screen p-8 flex flex-col items-center bg-[#DEE2E6]">
        <h2 className="text-2xl font-bold my-7">마이페이지</h2>
        <StateCardContainer />
        <PersonalInfoCard
        // icon={<YourExistingIcon />} // ← 아이콘 “냅둠”
        />

        <UploadHistory onPageChange={getUserInfo} />
      </main>
    </>
  );
};

export default MyPage;
