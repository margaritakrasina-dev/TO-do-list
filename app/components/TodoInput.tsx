// components/TodoInput.tsx
"use client";
import { useState } from "react";

export default function TodoInput({ onAddTask }: { onAddTask: (task: string) => void }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() === "") return;
    onAddTask(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-6">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Zadej úkol..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        Přidat
      </button>
    </form>
  );
}
