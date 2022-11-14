import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Logout: React.FC = () => {
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
