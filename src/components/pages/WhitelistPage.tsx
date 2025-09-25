import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const WhitelistPage: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <div className="flex justify-between items-center ml-6 mt-6">
        <h3 className="text-2xl font-semibold mb-6">화이트리스트</h3>
      </div>
      {/* 탭 네비게이션 */}
      <nav className="mb-6">
        <div className="flex gap-2 border-b">
          <Link
            to="/admin/whitelist/list"
            className={`px-4 py-2 transition ${
              pathname === "/admin/whitelist/list" ||
              pathname === "/admin/whitelist"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            화이트리스트
          </Link>
          <Link
            to="/admin/whitelist/requests"
            className={`px-4 py-2 transition ${
              pathname === "/admin/whitelist/requests"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            권한 요청
          </Link>
          <Link
            to="/admin/whitelist/managers"
            className={`px-4 py-2 transition ${
              pathname === "/admin/whitelist/managers"
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            관리자 관리
          </Link>
        </div>
      </nav>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default WhitelistPage;
