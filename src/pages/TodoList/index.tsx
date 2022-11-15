import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { NotFound } from "../../components/common/NotFound/NotFound";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { supabase } from "../../config/supabaseClient";

interface ToDo {
  id: string;
  description: string;
  active: boolean;
}

export default function TodoList() {
  const [session, setSession] = useState<Session | null>(null);

  const [newTodo, setNewTodo] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const [todoList, setTodoList] = useState<ToDo[]>([]);

  const handleTodoUpdate = () => {
    supabase
      .channel("public:todo")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todo" },
        (payload) => {
          if (payload.eventType === "DELETE")
            setTodoList((todos) =>
              todos.filter((todo) => todo.id !== payload.old.id)
            );
          else setTodoList((todos) => [...todos, payload.new as ToDo]);

          const element = document.getElementById("scrollInto");
          if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            window.setTimeout(
              () => element.scrollIntoView({ behavior: "smooth" }),
              300
            );
          }
        }
      )
      .subscribe();
  };

  const handleAddTodo = async (e: any) => {
    e.preventDefault();

    try {
      await supabase
        .from("todo")
        .insert([{ description: newTodo, user_id: session?.user.id }]);

      setNewTodo("");
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("todo").delete().eq("id", id);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const getUrl = async (id: string) => {
    try {
      let { data } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", id)
        .single();
      setUrl(data?.avatar_url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const getTodoList = async (id: string) => {
    try {
      let { data } = await supabase.from("todo").select(`*`).eq("user_id", id);
      setTodoList(data as ToDo[]);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        getUrl(session?.user.id);
        getTodoList(session.user.id);
        setSession(session);
      }
    });

    handleTodoUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex">
      <PageTitle>Tarefas de Hoje</PageTitle>

      <div
        className="flex flex-col items-center justify-center grow h-full"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-mono text-2xl font-bold">Lots of Things ToDo</h1>

          <div style={{ margin: "auto" }}>
            <Link to={"/perfil"}>
              <Avatar url={url} size={40} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-1 max-h-80 overflow-auto my-4 w-80">
          {todoList.length > 0 ? (
            todoList.map((todo) => (
              <div key={`todo-${todo.id}`} className="flex items-center gap-2">
                <input
                  id="todo"
                  className="form-control
                    my-1
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                  "
                  type="todo"
                  disabled
                  value={todo.description}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                  className="inline-block px-4 border-2 h-10 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  aria-live="polite"
                  onClick={() => handleDelete(todo.id)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <NotFound />
          )}

          <div id="scrollInto" />
        </div>

        <form onSubmit={handleAddTodo} className="w-80">
          <label className="block">
            <span className="block text-md font-medium text-slate-500">
              Nova tarefa
            </span>
            <input
              id="todo"
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
              type="todo"
              placeholder="Descrição"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </label>
          <button
            className="mb-2 w-full inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            aria-live="polite"
            type="submit"
            disabled={newTodo.length < 4}
          >
            Adicionar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}
