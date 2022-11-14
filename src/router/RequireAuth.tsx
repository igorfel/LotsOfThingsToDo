import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { WithChildrenProps } from "../types/generalTypes";
import { supabase } from "../config/supabaseClient";
import { Session } from "@supabase/supabase-js";
import Loading from "../components/common/Loading";

export default function RequireAuth({ children }: WithChildrenProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return session ? <>{children}</> : <Navigate to="/auth/login" replace />;
}
