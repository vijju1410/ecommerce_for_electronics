import React from "react";
import { Outlet } from "react-router-dom";
import AdminPanel from "./AdminPanel";

function AdminLayout() {
  return (
    <div className="flex">
      <AdminPanel />
      <div className="flex-grow p-6">
        <Outlet />  {/* This will render nested routes like /admin/orders */}
      </div>
    </div>
  );
}

export default AdminLayout;
