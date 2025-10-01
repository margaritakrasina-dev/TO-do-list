"use client";
import TodoItem from "./TodoItem";

export default function TodoList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: { id: string; text: string; completed: boolean }[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0)
    return <p className="text-gray-500 mt-6 text-center">Žádné úkoly zatím.</p>;

  return (
    <div className="flex flex-col gap-3 mt-6">
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
