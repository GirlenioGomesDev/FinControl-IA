import { AppShell } from "@/components/app-shell";
import { IncomeForm, IncomesTable } from "@/components/finance-forms";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData } from "@/lib/queries";

export default async function IncomesPage() {
  const { incomes } = await getUserFinancialData();
  return (
    <AppShell title="Entradas e lucros" subtitle="Registre receitas, ganhos, bonus e qualquer entrada financeira manual.">
      <div className="space-y-5">
        <Card><CardTitle title="Nova entrada" /><IncomeForm /></Card>
        <Card><CardTitle title="Historico de entradas" /><IncomesTable items={incomes} /></Card>
      </div>
    </AppShell>
  );
}
