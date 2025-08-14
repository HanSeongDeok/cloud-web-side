import React from "react";
import { Outlet } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <>
      <main className="min-h-screen p-8">
        <h2 className="text-2xl font-bold mb-6">관리자 페이지</h2>
        {/* Outlet으로 하위 페이지 렌더링 */}
        <Outlet />
      </main>
    </>
  );
};

export default AdminPage;
