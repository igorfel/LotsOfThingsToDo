import { useState } from "react";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { supabase } from "../../config/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setLinkSent(true);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <div className="flex">
      <PageTitle>Entrar</PageTitle>

      <div
        className="flex flex-col items-center justify-center grow h-full"
        aria-live="polite"
      >
        <div className="flex flex-col items-center my-10">
          <h1 className="font-mono text-3xl font-bold">Lots of Things ToDo</h1>
          <p className="text-sm">
            Entre com link mágico usando seu email abaixo
          </p>
        </div>
        {loading ? (
          "Enviando link mágico..."
        ) : (
          <form onSubmit={handleLogin}>
            <label className="block">
              <span className="block text-md font-medium text-slate-500">
                Email
              </span>
              <input
                id="email"
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
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {linkSent && (
                <span className="text-sm text-green-500 mt-1">
                  Link enviado com sucesso!
                </span>
              )}
            </label>

            <button
              className="mb-8 w-full inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              aria-live="polite"
              type="submit"
            >
              Enviar link mágico
            </button>
            <button
              type="button"
              className="mb-2 w-full inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              aria-live="polite"
              onClick={signInWithGoogle}
            >
              Entrar com Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
