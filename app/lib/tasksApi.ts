// lib/tasksApi.ts
import { supabase } from "./supabaseClient";

// načtení všech úkolů
export async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// přidání úkolu
export async function addTask(text: string) {
  const { error } = await supabase.from("tasks").insert([{ text, completed: false }]);
  if (error) throw error;
}

// označení hotového úkolu
export async function toggleTask(id: string, completed: boolean) {
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw error;
}

// smazání úkolu
export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
