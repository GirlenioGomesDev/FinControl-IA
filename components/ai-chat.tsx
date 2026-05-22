"use client";

import { Bot, Send } from "lucide-react";
import { useState } from "react";

export function AiChat() {
  const [question, setQuestion] = useState("O que posso melhorar nos meus gastos?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAnswer("");
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    setAnswer(data.answer || data.error || "Nao foi possivel gerar a resposta agora.");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={ask} className="flex flex-col gap-3 sm:flex-row">
        <input value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-11 flex-1 rounded-lg border bg-white/80 px-4 outline-none ring-emerald/25 transition focus:ring-4 dark:bg-white/10" />
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-semibold text-pearl dark:bg-pearl dark:text-ink">
          <Send size={16} /> Perguntar
        </button>
      </form>
      <div className="min-h-48 rounded-lg border bg-emerald/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-semibold"><Bot size={18} className="text-emerald" />Analise</div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-ink/75 dark:text-pearl/75">{loading ? "Analisando seus dados financeiros..." : answer || "Pergunte sobre categorias, valores guardados, comparativos e oportunidades de economia."}</p>
      </div>
    </div>
  );
}
