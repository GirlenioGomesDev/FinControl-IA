"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "recover" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const origin = window.location.origin;
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === "signup"
          ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/dashboard` } })
          : await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/login` });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "recover") {
      setMessage("Enviamos as instrucoes de recuperacao para seu e-mail.");
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium">
        E-mail
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-lg border bg-white/80 px-4 py-3 outline-none ring-emerald/30 transition focus:ring-4 dark:bg-white/10" />
      </label>
      {mode !== "recover" ? (
        <label className="block text-sm font-medium">
          Senha
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className="mt-2 w-full rounded-lg border bg-white/80 px-4 py-3 outline-none ring-emerald/30 transition focus:ring-4 dark:bg-white/10" />
        </label>
      ) : null}
      {message ? <p className="rounded-lg border border-champagne/40 bg-champagne/10 px-3 py-2 text-sm">{message}</p> : null}
      <button disabled={loading} className="w-full rounded-lg bg-ink px-4 py-3 font-semibold text-pearl shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-pearl dark:text-ink">
        {loading ? "Processando..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha"}
      </button>
      <div className="flex flex-wrap justify-between gap-3 text-sm text-ink/65 dark:text-pearl/65">
        {mode !== "login" ? <Link href="/auth/login">Ja tenho conta</Link> : <Link href="/auth/cadastro">Criar cadastro</Link>}
        {mode !== "recover" ? <Link href="/auth/recuperar-senha">Esqueci minha senha</Link> : null}
      </div>
    </form>
  );
}
