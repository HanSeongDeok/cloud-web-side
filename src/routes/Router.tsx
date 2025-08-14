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
import ProtectedRoute from "@/components/ProtestedRoute";
import Home from "@/components/Home";

const Router: React.FC = () => {
  return (
    <Routes>
      {/* 독립적인 페이지들 - Layout 없이 */}
      <Route path="/home" element={<Home />}></Route>
      <Route path="/block" element={<BlockPage />} />
      <Route path="/permission" element={<PermissionPage />} />
      <Route path="/login" element={<SSOLoginPage />} />
      <Route path="/login-verify" element={<SSOLoginVerifyPage />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl"> 404 - Not Found </h1>
          </div>
        }
      />
      {/* Layout이 적용되는 메인 애플리케이션 페이지들 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" />} />
        {/* 보호된 라우트들 */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="storage" element={<StoragePage />} />
        {/* </Route> */}
        <Route path="my-page" element={<MyPage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* 관리자 전용 페이지 */}
        <Route path="admin" element={<AdminPage />}>
          <Route path="logging" element={<LoggingPage />} />
          <Route path="db-config" element={<DbConfigPage />} />

          {/* whitelist 페이지 (탭뷰 포함) */}
          <Route path="whitelist" element={<WhitelistPage />}>
            {/* whitelist 하위 탭들 */}
            <Route index element={<Navigate to="/admin/whitelist/list" />} />
            <Route path="list" element={<WhitelistListTab />} />
            <Route path="requests" element={<WhitelistRequestsTab />} />
            <Route path="managers" element={<ManagersTab />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
