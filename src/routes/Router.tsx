import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import StoragePage from "@/components/pages/StoragePage";
import DashboardPage from "@/components/pages/DashboardPage";
import AdminPage from "@/components/pages/AdminPage";
import Layout from "@/layout/Layout";
import MyPage from "@/components/pages/MyPage";
import TrashPage from "@/components/pages/TrashPage";
import LoggingPage from "@/components/pages/LoggingPage";
import DbConfigPage from "@/components/pages/DbConfigPage";
import BlockPage from "@/components/pages/BlockPage";
import WhitelistPage from "@/components/pages/WhitelistPage";
import WhitelistListTab from "@/components/pages/WhitelistTab";
import WhitelistRequestsTab from "@/components/pages/WhitelistRequestsTab";
import ManagersTab from "@/components/pages/ManagersTab";
import { SSOLoginPage } from "@/components/pages/SSOLoginPage";
import PermissionPage from "@/components/pages/PermissionPage";
import { SSOLoginVerifyPage } from "@/components/pages/SSOLoginVerifyPage";
import Home from "@/components/Home";
import { ROUTE_PATH } from "@/api/path.config";
import ProtectedRoute from "@/components/ProtestedRoute";
import DashBoard from "@/components/DashBoard";

const Router: React.FC = () => {
  return (
    <Routes>
      {/* 독립적인 페이지들 - Layout 없이 */}
      <Route path={ROUTE_PATH.HOME} element={<Home />}></Route>
      <Route path={ROUTE_PATH.BLOCK} element={<BlockPage />} />
      <Route path={ROUTE_PATH.PERMISSION} element={<PermissionPage />} />
      <Route path={ROUTE_PATH.LOGIN} element={<SSOLoginPage />} />
      <Route path={ROUTE_PATH.LOGIN_VERIFY} element={<SSOLoginVerifyPage />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl"> 404 - Not Found </h1>
          </div>
        }
      />
      {/* Layout이 적용되는 메인 애플리케이션 페이지들 */}
      <Route path={ROUTE_PATH.ROOT} element={<Layout />}>
        <Route index element={<Navigate to={ROUTE_PATH.HOME} />} />
        {/* 보호된 라우트들 */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path={ROUTE_PATH.STORAGE} element={<StoragePage />} />
        {/* </Route> */}
        <Route path={ROUTE_PATH.MY_PAGE} element={<MyPage />} />
        <Route path={ROUTE_PATH.TRASH} element={<TrashPage />} />
        <Route path={ROUTE_PATH.DASHBOARD} element={<DashBoard />} />
        {/* 관리자 전용 페이지 */}
        <Route path={ROUTE_PATH.ADMIN_ROOT} element={<AdminPage />}>
          <Route path={ROUTE_PATH.ADMIN_LOGGING} element={<LoggingPage />} />
          <Route path={ROUTE_PATH.ADMIN_DB_CONFIG} element={<DbConfigPage />} />

          {/* whitelist 페이지 (탭뷰 포함) */}
          <Route path={ROUTE_PATH.WHITELIST_ROOT} element={<WhitelistPage />}>
            {/* whitelist 하위 탭들 */}
            <Route
              index
              element={<Navigate to={ROUTE_PATH.WHITELIST_LIST} />}
            />
            <Route
              path={ROUTE_PATH.WHITELIST_LIST}
              element={<WhitelistListTab />}
            />
            <Route
              path={ROUTE_PATH.WHITELIST_REQUESTS}
              element={<WhitelistRequestsTab />}
            />
            <Route
              path={ROUTE_PATH.WHITELIST_MANAGERS}
              element={<ManagersTab />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
