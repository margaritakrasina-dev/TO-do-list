"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else {
      setMessage("✅ Heslo bylo úspěšně změněno! Přihlašte se znovu.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Změna hesla
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Zadej nové heslo"
            className="w-full border border-gray-300 bg-gray-50 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
          >
            Uložit nové heslo
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4 bg-gray-100 py-2 rounded">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
