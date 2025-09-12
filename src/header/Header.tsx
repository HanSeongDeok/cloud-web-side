import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    // logout 로직 구현 예정
    console.log("로그아웃");
  };

  // NavLink 활성 상태 스타일
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-blue-400 transition ${
      isActive ? "underline underline-offset-4 font-bold" : ""
    }`;

  return (
    <header className="bg-gray-900 text-white px-8 py-4 shadow flex items-center justify-between relative">
      {/* 좌측 앱 타이틀 */}
      <div className="font-bold text-xl tracking-tight">VTDM</div>

      {/* 중앙 네비게이션 */}
      <nav className="flex gap-8 text-lg">
        <NavLink to="/storage" className={navLinkClass}>
          저장소
        </NavLink>

        <NavLink to="/dashboard" className={navLinkClass}>
          대시보드
        </NavLink>

        {/* 관리자 드롭다운 */}
        <div
          className="relative"
          onMouseEnter={() => setAdminDropdownOpen(true)}
          onMouseLeave={() => setAdminDropdownOpen(false)}
        >
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `hover:text-blue-400 transition flex items-center gap-1 ${
                isActive ? "underline underline-offset-4 font-bold" : ""
              }`
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            관리자
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </NavLink>

          {/* 관리자 드롭다운 메뉴 */}
          {adminDropdownOpen && (
            <>
              {/* 보이지 않는 브리지 영역 */}
              <div className="absolute top-full left-0 w-full h-1 bg-transparent"></div>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <NavLink
                  to="/admin/logging"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  로그 관리
                </NavLink>
                <NavLink
                  to="/admin/whitelist"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  화이트리스트
                </NavLink>
                <NavLink
                  to="/admin/db-config"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  DB 관리
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* 우측 사용자 프로필 드롭다운 */}
      <div
        className="relative"
        onMouseEnter={() => setProfileDropdownOpen(true)}
        onMouseLeave={() => setProfileDropdownOpen(false)}
      >
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
          <div className="text-sm">
            <span className="text-blue-400">admin</span>
            <span className="text-gray-400 ml-2">(관리자)</span>
          </div>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* 프로필 드롭다운 메뉴 */}
        {profileDropdownOpen && (
          <>
            {/* 보이지 않는 브리지 영역 */}
            <div className="absolute top-full right-0 w-full h-1 bg-transparent"></div>
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <NavLink
                to="/my-page"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                마이페이지
              </NavLink>
              <NavLink
                to="/trash"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                휴지통
              </NavLink>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
