"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [canChange, setCanChange] = useState(false);
  const router = useRouter();

  // 🧠 Ověří, že uživatel přišel z e-mailového odkazu (type=recovery)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setCanChange(true);
    } else {
      setMessage("⚠️ Tento odkaz pro obnovu hesla je neplatný nebo již vypršel.");
    }
  }, []);

  // 🟢 Změna hesla
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("❌ Heslo musí mít alespoň 6 znaků.");
      return;
    }

    if (password !== confirm) {
      setMessage("❌ Hesla se neshodují.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("❌ Chyba při změně hesla: " + error.message);
    } else {
      setMessage("✅ Heslo bylo úspěšně změněno! Budete přesměrováni na přihlášení...");
      setTimeout(() => router.push("/login"), 2500);
    }
  };

  // ⚠️ Pokud odkaz není platný
  if (!canChange && !message.includes("Heslo bylo")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">{message || "Načítání..."}</p>
      </div>
    );
  }

  // ✅ Formulář pro změnu hesla
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Obnova hesla
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Nové heslo */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nové heslo
            </label>
            <input
              type="password"
              placeholder="Zadej nové heslo"
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Potvrzení hesla */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Potvrď nové heslo
            </label>
            <input
              type="password"
              placeholder="Zadej heslo znovu"
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {/* Tlačítko */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md"
          >
            Uložit nové heslo
          </button>
        </form>

        {/* Zpráva */}
        {message && (
          <p className="text-center text-sm text-gray-700 mt-4 bg-gray-100 py-2 rounded">
            {message}
          </p>
        )}

        {/* Odkaz zpět */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <a
            href="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Zpět na přihlášení
          </a>
        </div>
      </div>
    </div>
  );
}
