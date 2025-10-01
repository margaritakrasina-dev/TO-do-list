"use client";

import { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { fetchTasks, addTask, toggleTask, deleteTask } from "./lib/tasksApi";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  // 💾 stav úkolů
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

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
    // ❗️Realtime to zachytí, ale pro jistotu okamžitě načteme i lokálně
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
    loadTasks(); // načti při otevření stránky

    // ✅ přihlášení k Realtime kanálu
    const channel = supabase
      .channel("realtime:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("📡 Změna v tasks tabulce:", payload.eventType, payload.new || payload.old);
          // kdykoliv se změní tabulka → načteme nové úkoly
          loadTasks();
        }
      )
      .subscribe();

    // 🧹 odhlášení při opuštění stránky
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mt-10">📝 Můj To-Do Seznam</h1>

      <div className="w-full max-w-md mt-4">
        {/* Vstup pro nový úkol */}
        <TodoInput onAddTask={handleAdd} />

        {/* Načítání */}
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Načítám úkoly...</p>
        ) : (
          <TodoList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
