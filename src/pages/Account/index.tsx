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
    <div
      className="flex flex-col items-center mt-10 grow h-full px-6 max-w-lg"
      aria-live="polite"
    >
      <PageTitle>Perfil</PageTitle>

      {loading ? (
        "Carregando ..."
      ) : (
        <form onSubmit={updateProfile} className="w-full">
          <AvatarUpload
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
          <div>Email: {session.user.email}</div>
          <label htmlFor="username">
            <span className="block text-md font-medium text-slate-500">
              Nome
            </span>

            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e: any) => setUsername(e.target.value)}
              className="form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </label>
          <label htmlFor="website" className="mt-2">
            <span className="block text-md font-medium text-slate-500">
              Website
            </span>
            <input
              id="website"
              type="url"
              value={website || ""}
              onChange={(e: any) => setWebsite(e.target.value)}
              className="form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </label>

          <div>
            <button
              className="mb-8 w-full inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              disabled={loading}
            >
              Atualizar perfil
            </button>
          </div>
          <Link to="/" className="w-full">
            <button
              type="button"
              className="w-full px-6 py-2 border-2 border-blue-400 text-blue-400 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Minhas tarefas
            </button>
          </Link>
        </form>
      )}

      <button
        type="button"
        className="block mt-4"
        onClick={() => supabase.auth.signOut()}
      >
        Sair
      </button>
    </div>
  );
};

export default Account;
