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
    <div className="row flex-center flex">
      <PageTitle>Entrar</PageTitle>

      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Lots of Things ToDo</h1>
        <p className="description">
          Entre com link mágico usando seu email abaixo
        </p>
        {loading ? (
          "Enviando link mágico..."
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {linkSent && (
              <span className="notify-span">Link enviado com sucesso!</span>
            )}
            <button
              className="button block mt-2"
              aria-live="polite"
              type="submit"
            >
              Enviar link mágico
            </button>
            <button
              type="button"
              className="button block"
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
