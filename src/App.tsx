import { useState, useEffect } from "react";
import { supabase } from "./config/supabaseClient";
import { Session } from "@supabase/supabase-js";
import Router from "./router";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      <Router session={session} />
    </div>
  );
}
