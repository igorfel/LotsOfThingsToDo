import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex h-screen justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
