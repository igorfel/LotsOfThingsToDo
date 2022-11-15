import React from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen justify-center">
      <Outlet />
    </div>
  );
}
