import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

import LoginPage from "../pages/Auth";
import RequireAuth from "./RequireAuth";
import { withLoading } from "../hocs/withLoading.hoc";
import MainLayout from "../components/layouts/main/MainLayout/MainLayout";

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(
  () => import("../components/layouts/AuthLayout/AuthLayout")
);

const AccountPage = React.lazy(() => import("../pages/Account"));
const TodoListPage = React.lazy(() => import("../pages/TodoList"));

const Error404Page = React.lazy(() => import("../pages/NotFound"));
const Logout = React.lazy(() => import("./Logout"));

const Account = withLoading(AccountPage);
const TodoList = withLoading(TodoListPage);

const Error404 = withLoading(Error404Page);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export default function AppRouter({ session }: { session: Session | null }) {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={protectedLayout}>
          <Route index element={<TodoList />} />
          <Route
            path="perfil"
            element={<Account key={session?.user.id} session={session} />}
          />
          <Route path="*" element={<Error404 />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
}
