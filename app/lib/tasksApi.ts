import { supabase } from "./supabaseClient";

// 🟢 Načtení úkolů jen pro přihlášeného uživatele
export async function fetchTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ Uživatel není přihlášen!");
    return [];
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id) // ✅ jen jeho úkoly
    .order("id", { ascending: false });

  if (error) {
    console.error("❌ Chyba při načítání úkolů:", error.message);
    return [];
  }

  return data || [];
}

// 🟢 Přidání nového úkolu (včetně user_id)
export async function addTask(text: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ Uživatel není přihlášen!");
    return;
  }

  const { error } = await supabase.from("tasks").insert([
    {
      text,
      completed: false,
      user_id: user.id, // ✅ přidáme ID aktuálního uživatele
    },
  ]);

  if (error) {
    console.error("❌ Chyba při přidání úkolu:", error.message);
  }
}

// 🟢 Přepínání stavu úkolu (hotovo / nehotovo)
export async function toggleTask(id: string, completed: boolean) {
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) {
    console.error("❌ Chyba při změně úkolu:", error.message);
  }
}

// 🟢 Smazání úkolu
export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("❌ Chyba při mazání úkolu:", error.message);
  }
}
