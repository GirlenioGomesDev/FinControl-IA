import { NextResponse } from "next/server";
import { getUserFinancialData, summarize } from "@/lib/queries";

export async function POST(request: Request) {
  const { question } = await request.json();
  const { expenses, incomes, savings, goals } = await getUserFinancialData();
  const summary = summarize(expenses, incomes, savings, goals);

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({
      answer: [
        "A chave OPENROUTER_API_KEY ainda nao foi configurada.",
        summary.aiSummary,
        `Entradas do mes: ${summary.totalIncomes}. Gastos do mes: ${summary.totalExpenses}. Valor guardado: ${summary.totalSaved}.`
      ].join("\n")
    });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "FinControl IA"
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: "Voce e um analista financeiro pessoal. Responda em portugues do Brasil, com orientacoes prudentes e sem inventar dados ausentes."
        },
        {
          role: "user",
          content: JSON.stringify({ question, summary, expenses: expenses.slice(0, 80), incomes: incomes.slice(0, 80), savings: savings.slice(0, 80), goals })
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Falha ao consultar a IA. Verifique OPENROUTER_API_KEY e OPENROUTER_MODEL." }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ answer: data.choices?.[0]?.message?.content || "Sem resposta da IA." });
}
