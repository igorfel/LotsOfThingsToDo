import "./styles/index.css";
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

  // console.log(session);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {/* {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )} */}
      <Router session={session} />
    </div>
  );
}
