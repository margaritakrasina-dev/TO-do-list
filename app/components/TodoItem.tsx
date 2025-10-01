"use client";
import { CheckCircle, Trash2 } from "lucide-react";

export default function TodoItem({
  task,
  onToggle,
  onDelete,
}: {
  task: { id: string; text: string; completed: boolean };
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border
        ${task.completed ? "opacity-60" : ""}`}
    >
      <span
        onClick={() => onToggle(task.id, !task.completed)}
        className={`cursor-pointer flex-1 text-lg ${
          task.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {task.text}
      </span>
      <div className="flex gap-2">
        <CheckCircle
          className={`cursor-pointer ${task.completed ? "text-green-500" : "text-gray-400"}`}
          onClick={() => onToggle(task.id, !task.completed)}
        />
        <Trash2 className="text-red-500 cursor-pointer" onClick={() => onDelete(task.id)} />
      </div>
    </div>
  );
}
