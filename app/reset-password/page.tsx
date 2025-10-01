"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  // 🔍 Kontrola, zda uživatel přišel z emailového odkazu
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsResetting(true); // => zobrazí formulář pro nové heslo
      }
    };
    checkSession();
  }, []);

  // ✉️ Odeslat email s odkazem na obnovení hesla
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", // po kliknutí v emailu sem přesměruje
    });
    if (error) setMessage(error.message);
    else setMessage("📩 Email pro obnovení hesla byl odeslán. Zkontroluj schránku.");
  };

  // 🔑 Změna hesla po kliknutí z emailu
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else {
      setMessage("✅ Heslo bylo úspěšně změněno! Přesměrovávám na přihlášení...");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {!isResetting ? (
          <>
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              Obnovení hesla
            </h2>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <input
                type="email"
                placeholder="Zadej svůj email"
                className="w-full border border-gray-300 bg-gray-50 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
              >
                Odeslat email
              </button>
            </form>
            {message && (
              <p className="text-center text-sm text-gray-700 mt-4 bg-gray-100 py-2 rounded">
                {message}
              </p>
            )}
            <p className="text-center mt-6 text-sm text-gray-600">
              Zpět na{" "}
              <a href="/login" className="text-green-700 font-semibold hover:underline">
                přihlášení
              </a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              Změna hesla
            </h2>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <input
                type="password"
                placeholder="Zadej nové heslo"
                className="w-full border border-gray-300 bg-gray-50 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          </>
        )}
      </div>
    </div>
  );
}
