"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { fetchTasks, addTask, toggleTask, deleteTask } from "./lib/tasksApi";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  // 🔐 přihlášený uživatel
  const [session, setSession] = useState<any>(null);

  // 💾 stav úkolů
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 🔎 Kontrola přihlášení při načtení stránky
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setSession(data.session);
        loadTasks();
      }
    };

    checkAuth();
  }, [router]);

  // 📥 načtení všech úkolů z databáze
  async function loadTasks() {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  // 🧩 přidání nového úkolu
  const handleAdd = async (text: string) => {
    await addTask(text);
    await loadTasks();
  };

  // 🔁 změna stavu úkolu (hotovo / nehotovo)
  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    await loadTasks();
  };

  // 🗑️ smazání úkolu
  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await loadTasks();
  };

  // 🔔 Realtime – reaguje na INSERT / UPDATE / DELETE v tabulce "tasks"
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("realtime:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("📡 Změna v tabulce tasks:", payload.eventType);
          loadTasks();
        }
      )
      .subscribe();

    // 🧹 Odhlášení při opuštění stránky
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  // ⏳ pokud ještě ověřujeme přihlášení
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Kontroluji přihlášení...</p>
      </main>
    );
  }

  // ✅ Hlavní obsah aplikace (uživatel přihlášen)
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="flex justify-between w-full max-w-md mt-10 mb-4">
        <h1 className="text-3xl font-bold text-green-600">📝 Můj To-Do Seznam</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Odhlásit se
        </button>
      </div>

      <div className="w-full max-w-md">
        <TodoInput onAddTask={handleAdd} />

        {loading ? (
          <p className="text-gray-500 text-center mt-6">Načítám úkoly...</p>
        ) : (
          <TodoList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
