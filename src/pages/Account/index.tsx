import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AvatarUpload from "../../components/AvatarUpload";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { supabase } from "../../config/supabaseClient";

const Account = ({ session }: { session: any }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite">
      <PageTitle>Perfil</PageTitle>
      {loading ? (
        "Carregando ..."
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <AvatarUpload
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
          <div>Email: {session.user.email}</div>
          <div>
            <label htmlFor="username">Nome</label>
            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={website || ""}
              onChange={(e: any) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <button className="button primary block" disabled={loading}>
              Atualizar perfil
            </button>
          </div>
          <Link to="/">
            <button type="button" className="button block">
              Minhas tarefas
            </button>
          </Link>
        </form>
      )}

      <button
        type="button"
        className="button block mt-2"
        onClick={() => supabase.auth.signOut()}
      >
        Sair
      </button>
    </div>
  );
};

export default Account;
