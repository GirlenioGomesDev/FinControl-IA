import { Plus, Trash2 } from "lucide-react";
import { createExpense, createGoal, createIncome, createSaving, deleteExpense, deleteGoal, deleteIncome, deleteSaving } from "@/lib/actions";
import { money } from "@/lib/utils";
import type { Expense, Goal, Income, Saving } from "@/lib/types";

const input = "rounded-lg border bg-white/80 px-3 py-2 text-sm outline-none ring-emerald/25 transition focus:ring-4 dark:bg-white/10";

export function ExpenseForm() {
  return (
    <form action={createExpense} className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <input name="description" placeholder="Descricao" required className={input} />
      <input name="amount" placeholder="Valor" type="number" step="0.01" required className={input} />
      <input name="category" placeholder="Categoria" required className={input} />
      <input name="paid_at" type="date" required className={input} />
      <input name="payment_method" placeholder="Pagamento" required className={input} />
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink"><Plus size={16} />Adicionar</button>
      <textarea name="notes" placeholder="Observacao opcional" className={`${input} md:col-span-2 xl:col-span-6`} />
    </form>
  );
}

export function ExpensesTable({ items }: { items: Expense[] }) {
  return <Table rows={items.map((item) => [item.description, money(item.amount), item.category, item.payment_method, item.paid_at, item.id])} action={deleteExpense} />;
}

export function IncomeForm() {
  return (
    <form action={createIncome} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input name="description" placeholder="Descricao" required className={input} />
      <input name="amount" placeholder="Valor" type="number" step="0.01" required className={input} />
      <input name="source" placeholder="Origem" required className={input} />
      <input name="received_at" type="date" required className={input} />
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink"><Plus size={16} />Adicionar</button>
      <textarea name="notes" placeholder="Observacao opcional" className={`${input} md:col-span-2 xl:col-span-5`} />
    </form>
  );
}

export function IncomesTable({ items }: { items: Income[] }) {
  return <Table rows={items.map((item) => [item.description, money(item.amount), item.source, item.received_at, "", item.id])} action={deleteIncome} />;
}

export function SavingForm() {
  return (
    <form action={createSaving} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input name="amount" placeholder="Valor" type="number" step="0.01" required className={input} />
      <input name="goal" placeholder="Objetivo" required className={input} />
      <input name="saved_at" type="date" required className={input} />
      <input name="notes" placeholder="Observacao" className={input} />
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink"><Plus size={16} />Registrar</button>
    </form>
  );
}

export function SavingsTable({ items }: { items: Saving[] }) {
  return <Table rows={items.map((item) => [item.goal, money(item.amount), item.saved_at, item.notes || "", "", item.id])} action={deleteSaving} />;
}

export function GoalForm() {
  return (
    <form action={createGoal} className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <input name="name" placeholder="Meta" required className={input} />
      <input name="target_amount" placeholder="Valor alvo" type="number" step="0.01" required className={input} />
      <input name="current_amount" placeholder="Atual" type="number" step="0.01" defaultValue="0" required className={input} />
      <input name="due_date" type="date" className={input} />
      <select name="status" className={input} defaultValue="ativa"><option value="ativa">Ativa</option><option value="concluida">Concluida</option><option value="pausada">Pausada</option></select>
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink"><Plus size={16} />Criar</button>
    </form>
  );
}

export function GoalsTable({ items }: { items: Goal[] }) {
  return <Table rows={items.map((item) => [item.name, `${money(item.current_amount)} / ${money(item.target_amount)}`, item.status, item.due_date || "-", "", item.id])} action={deleteGoal} />;
}

function Table({ rows, action }: { rows: string[][]; action: (formData: FormData) => Promise<void> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <tbody className="divide-y">
          {rows.length ? rows.map((row) => (
            <tr key={row[5]} className="transition hover:bg-emerald/5">
              {row.slice(0, 5).map((cell, index) => <td key={index} className="px-3 py-3">{cell}</td>)}
              <td className="px-3 py-3 text-right">
                <form action={action}>
                  <input type="hidden" name="id" value={row[5]} />
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-wine transition hover:bg-wine/10" aria-label="Excluir" title="Excluir"><Trash2 size={16} /></button>
                </form>
              </td>
            </tr>
          )) : (
            <tr><td className="px-3 py-8 text-center text-ink/55 dark:text-pearl/55">Nenhum registro cadastrado ainda.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
