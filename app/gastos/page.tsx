import { AppShell } from "@/components/app-shell";
import { ExpenseForm, ExpensesTable } from "@/components/finance-forms";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData } from "@/lib/queries";

export default async function ExpensesPage() {
  const { expenses } = await getUserFinancialData();
  return (
    <AppShell title="Gastos" subtitle="Cadastre, acompanhe e exclua despesas manuais com categoria, data e forma de pagamento.">
      <div className="space-y-5">
        <Card><CardTitle title="Novo gasto" /><ExpenseForm /></Card>
        <Card><CardTitle title="Lista de gastos" subtitle="Os dados sao filtrados por usuario pelas politicas RLS do Supabase." /><ExpensesTable items={expenses} /></Card>
      </div>
    </AppShell>
  );
}
