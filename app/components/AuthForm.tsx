"use client";
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  type: "login" | "register" | "reset";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "✅ Úspěšně zaregistrováno! Zkontroluj email.");
    }

    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push("/");
    }

    if (type === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });
      setMessage(error ? error.message : "📩 Zkontroluj svůj email pro obnovení hesla.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {type === "login" && "Přihlášení"}
          {type === "register" && "Registrace"}
          {type === "reset" && "Obnovení hesla"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Zadej svůj email"
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Heslo (pokud nejde o reset) */}
          {type !== "reset" && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Heslo</label>
              <input
                type="password"
                placeholder="Zadej své heslo"
                className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {/* Tlačítko */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md"
          >
            {type === "login" && "Přihlásit se"}
            {type === "register" && "Registrovat se"}
            {type === "reset" && "Odeslat email"}
          </button>

          {/* Zpráva */}
          {message && (
            <p className="text-center text-sm text-gray-700 mt-3 bg-gray-100 py-2 rounded">
              {message}
            </p>
          )}
        </form>

        {/* Odkazy */}
        <div className="text-center mt-6 text-sm text-gray-600">
          {type === "login" && (
            <>
              <p className="mb-2">
                Nemáš účet?{" "}
                <a href="/register" className="text-green-700 font-semibold hover:underline">
                  Registruj se
                </a>
              </p>
              <p>
                Zapomněl jsi heslo?{" "}
                <a href="/reset-password" className="text-green-700 font-semibold hover:underline">
                  Obnovit heslo
                </a>
              </p>
            </>
          )}
          {type === "register" && (
            <p>
              Už máš účet?{" "}
              <a href="/login" className="text-green-700 font-semibold hover:underline">
                Přihlaš se
              </a>
            </p>
          )}
          {type === "reset" && (
            <p>
              Zpět na{" "}
              <a href="/login" className="text-green-700 font-semibold hover:underline">
                přihlášení
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
