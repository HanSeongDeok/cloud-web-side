// src/components/dbconfig/DbPropertyTable.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  IServerSideGetRowsParams,
  GridReadyEvent,
  GridApi,
} from "ag-grid-enterprise";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import {
  AllEnterpriseModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-enterprise";
import { provideGlobalGridOptions, TooltipModule } from "ag-grid-enterprise";
import type { LogsResponse } from "@/types/log";
import type { ActionType } from "@/types/log";
import { columnDefs as baseColumnDefs } from "@/handlers/events/log.config.handler";
import { getLatestLogs } from "@/handlers/services/log.service.handler";

provideGlobalGridOptions({
  theme: "legacy",
});
ModuleRegistry.registerModules([
  AllEnterpriseModule,
  TooltipModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

export type LogTableProps = {
  keyword: string;
  timeRangeEnabled: boolean;
  startTime: string;
  endTime: string;
};

const LogTable = (props: LogTableProps) => {
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<any>(null);
  const { keyword, timeRangeEnabled, startTime, endTime } = props;
  const [loading, setLoading] = useState(false);
  const actionTypeValues: ActionType[] = [
    "LOGIN",
    "LOGOUT",
    "FILE_UPLOAD",
    "FILE_DOWNLOAD",
    "FILE_EDIT",
    "FILE_MOVE",
    "FILE_DELETE",
    "FILE_DELETE_PERMANENT",
    "FILE_RESTORE",
    "GROUP_UPLOAD",
    "GROUP_DOWNLOAD",
    "GROUP_EDIT",
    "GROUP_DELETE",
    "GROUP_DELETE_PERMANENT",
    "PERMISSION_REQUEST",
    "APPROVE_REQUEST",
    "PROP_ADD",
    "PROP_REMOVE",
    "PROP_EDIT",
    "LUT_ADD",
    "LUT_REMOVE",
    "LUT_EDIT",
    "WHITELIST_ACCEPT",
    "WHITELIST_REJECT",
    "WHITELIST_TEAM_DELETE",
    "WHITELIST_USER_DELETE",
    "ADMIN_GRANT",
    "ADMIN_REVOKE",
  ];
  const [columnDefs] = useState(() =>
    baseColumnDefs.map((col) =>
      col.field === "action"
        ? {
            ...col,
            filter: "agSetColumnFilter",
            filterParams: {
              values: actionTypeValues,
            },
          }
        : col
    )
  );

  // 서버 페이징만 사용하는 구조로 교체
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    // 최초 1회만 빈 datasource 등록, 실제 데이터는 datasourceRef에서 관리
    params.api.setGridOption("serverSideDatasource", {
      getRows: (...args) => datasourceRef.current?.getRows(...args),
    });
  }, []);

  // 항상 최신 props를 참조하는 datasource를 useEffect로 갱신
  useEffect(() => {
    console.log("keyword 변경:", keyword);
    datasourceRef.current = {
      getRows: (gridParams: IServerSideGetRowsParams) => {
        setLoading(true);
        const req = gridParams.request;
        if (
          req &&
          typeof req.startRow === "number" &&
          typeof req.endRow === "number" &&
          req.endRow > req.startRow
        ) {
          const pageSize = req.endRow - req.startRow;
          const page = Math.floor(req.startRow / pageSize);
          const logRequest = {
            page: page.toString(),
            size: pageSize.toString(),
            actions: (req.filterModel as any)?.action?.values as
              | ActionType[]
              | undefined,
            searchTerm: keyword && keyword.trim() !== "" ? keyword : undefined,
            start:
              timeRangeEnabled && startTime && startTime.trim() !== ""
                ? startTime
                : undefined,
            end:
              timeRangeEnabled && endTime && endTime.trim() !== ""
                ? endTime
                : undefined,
          };
          if (logRequest.searchTerm === "") logRequest.searchTerm = undefined;
          console.log("LogTable getRows 호출", logRequest);
          getLatestLogs(logRequest)
            .then((data: LogsResponse) => {
              gridParams.success({
                rowData: data.logs,
                rowCount: data.total,
              });
              setLoading(false);
            })
            .catch((err) => {
              console.error("[LogTable] getLatestLogs 에러:", err);
              gridParams.fail();
              setLoading(false);
            });
        } else {
          gridParams.fail();
          setLoading(false);
        }
      },
    };
    if (gridApiRef.current) {
      // 스크롤을 가장 상단(첫 번째 row)으로 이동
      gridApiRef.current.refreshServerSide();
      gridApiRef.current.ensureIndexVisible(0, "top");
    }
  }, [keyword, timeRangeEnabled, startTime, endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gridApiRef.current) {
        // getVerticalPixelRange().top === 0 이면 스크롤 맨 위
        const range = gridApiRef.current.getVerticalPixelRange?.();
        if (range && range.top === 0) {
          gridApiRef.current.refreshServerSide();
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        className="ag-theme-alpine w-full"
        style={{
          height: "calc(100vh - 300px)",
          width: "100%",
          minWidth: "95vw",
          minHeight: "600",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          sideBar={"columns"}
          loading={false}
          rowModelType={"serverSide"}
          onGridReady={onGridReady}
          cacheBlockSize={50}
          maxBlocksInCache={2}
          tooltipShowMode={"standard"}
          animateRows={true}
        />
      </div>
    </div>
  );
};

LogTable.displayName = "LogTable";

export default LogTable;
