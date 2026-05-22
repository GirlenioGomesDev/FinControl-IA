import { startOfMonth, subMonths } from "date-fns";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Backup, Expense, Goal, Income, Saving } from "@/lib/types";

export async function getUserFinancialData() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Unauthenticated");

  const [expenses, incomes, savings, goals, backups] = await Promise.all([
    supabase.from("expenses").select("*").order("paid_at", { ascending: false }),
    supabase.from("incomes").select("*").order("received_at", { ascending: false }),
    supabase.from("savings").select("*").order("saved_at", { ascending: false }),
    supabase.from("goals").select("*").order("created_at", { ascending: false }),
    supabase.from("backups").select("*").order("period_start", { ascending: false })
  ]);

  return {
    user: userData.user,
    expenses: (expenses.data || []) as Expense[],
    incomes: (incomes.data || []) as Income[],
    savings: (savings.data || []) as Saving[],
    goals: (goals.data || []) as Goal[],
    backups: (backups.data || []) as Backup[]
  };
}

export function summarize(expenses: Expense[], incomes: Income[], savings: Saving[], goals: Goal[]) {
  const now = new Date();
  const start = startOfMonth(now).toISOString().slice(0, 10);
  const monthExpenses = expenses.filter((item) => item.paid_at >= start);
  const monthIncomes = incomes.filter((item) => item.received_at >= start);
  const totalExpenses = monthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncomes = monthIncomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalSaved = savings.reduce((sum, item) => sum + Number(item.amount), 0);
  const goalsTarget = goals.reduce((sum, item) => sum + Number(item.target_amount), 0);
  const goalsCurrent = goals.reduce((sum, item) => sum + Number(item.current_amount), 0);

  const categories = Object.entries(
    monthExpenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(now, 5 - index);
    const key = date.toISOString().slice(0, 7);
    return {
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date),
      gastos: expenses.filter((item) => item.paid_at.startsWith(key)).reduce((sum, item) => sum + Number(item.amount), 0),
      entradas: incomes.filter((item) => item.received_at.startsWith(key)).reduce((sum, item) => sum + Number(item.amount), 0)
    };
  });

  return {
    balance: totalIncomes - totalExpenses,
    totalExpenses,
    totalIncomes,
    totalSaved,
    goalsProgress: goalsTarget ? (goalsCurrent / goalsTarget) * 100 : 0,
    categories,
    monthly,
    aiSummary:
      categories[0]
        ? `Sua maior concentracao de gastos no mes esta em ${categories[0].name}. Revise recorrencias e defina um teto semanal.`
        : "Cadastre suas primeiras transacoes para liberar analises personalizadas."
  };
}
