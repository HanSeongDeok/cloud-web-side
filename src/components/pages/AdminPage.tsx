import React from "react";
import { Outlet } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <>
      <main className="min-h-screen p-4">
        <Outlet />
      </main>
    </>
  );
};

export default AdminPage;
