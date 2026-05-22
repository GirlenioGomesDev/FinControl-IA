import { format, lastDayOfMonth } from "date-fns";
import type { Expense, Income, Saving } from "@/lib/types";

export function periodFileName(prefix: string, start: Date, extension: string) {
  const end = lastDayOfMonth(start);
  return `${prefix}_${format(start, "dd-MM-yyyy")}_a_${format(end, "dd-MM-yyyy")}.${extension}`;
}

export function financialCsv(expenses: Expense[], incomes: Income[], savings: Saving[]) {
  const rows = [
    ["tipo", "descricao", "valor", "categoria_ou_origem", "data", "observacao"],
    ...expenses.map((item) => ["gasto", item.description, item.amount, item.category, item.paid_at, item.notes || ""]),
    ...incomes.map((item) => ["entrada", item.description, item.amount, item.source, item.received_at, item.notes || ""]),
    ...savings.map((item) => ["guardado", item.goal, item.amount, item.goal, item.saved_at, item.notes || ""])
  ];

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function backupJson(expenses: Expense[], incomes: Income[], savings: Saving[]) {
  return JSON.stringify({ exported_at: new Date().toISOString(), expenses, incomes, savings }, null, 2);
}
