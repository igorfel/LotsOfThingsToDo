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
          console.log("Change received!", payload);
          if (payload.eventType === "DELETE")
            setTodoList((todos) =>
              todos.filter((todo) => todo.id !== payload.old.id)
            );
          else setTodoList((todos) => [...todos, payload.new as ToDo]);
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
    <div className="row flex-center flex">
      <PageTitle>Tarefas de Hoje</PageTitle>

      <div
        className="md:container md:mx-auto col-6 form-widget"
        aria-live="polite"
      >
        <div className="flex flex-center row">
          <h1 className="text-3x1 font-bold underline">Lots of Things ToDo</h1>

          <div style={{ margin: "auto" }}>
            <Link to={"/perfil"}>
              <Avatar url={url} size={40} />
            </Link>
          </div>
        </div>

        <div>
          {todoList.length > 0 ? (
            todoList.map((todo) => (
              <div key={`todo-${todo.id}`} className="flex">
                <input
                  id="todo"
                  className="inputField mt-1 mr-1"
                  type="todo"
                  disabled
                  value={todo.description}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                  className="mt-1 button block"
                  style={{ width: 60 }}
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
        </div>

        <form onSubmit={handleAddTodo}>
          <label htmlFor="todo">Nova tarefa</label>
          <input
            id="todo"
            className="inputField"
            type="todo"
            placeholder="Descrição"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="mt-1 button block"
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
