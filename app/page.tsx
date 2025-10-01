"use client";

import { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { fetchTasks, addTask, toggleTask, deleteTask } from "./lib/tasksApi";

export default function HomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // načtení úkolů z databáze
  async function loadTasks() {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (text: string) => {
    await addTask(text);
    await loadTasks();
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    await loadTasks();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await loadTasks();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mt-10">📝 Můj To-Do Seznam</h1>
      <div className="w-full max-w-md mt-4">
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
