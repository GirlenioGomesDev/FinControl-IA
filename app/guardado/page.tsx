import { PiggyBank } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SavingForm, SavingsTable } from "@/components/finance-forms";
import { StatCard } from "@/components/stat-card";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData, summarize } from "@/lib/queries";
import { money, percent } from "@/lib/utils";

export default async function SavingsPage() {
  const data = await getUserFinancialData();
  const summary = summarize(data.expenses, data.incomes, data.savings, data.goals);
  return (
    <AppShell title="Valor guardado" subtitle="Controle reservas, investimentos manuais e objetivos relacionados ao dinheiro acumulado.">
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <StatCard title="Total guardado" value={money(summary.totalSaved)} detail="Soma de todos os valores registrados" icon={PiggyBank} />
        <StatCard title="Progresso das metas" value={percent(summary.goalsProgress)} detail="Baseado nas metas cadastradas" icon={PiggyBank} />
      </div>
      <div className="space-y-5">
        <Card><CardTitle title="Registrar valor guardado" /><SavingForm /></Card>
        <Card><CardTitle title="Historico" /><SavingsTable items={data.savings} /></Card>
      </div>
    </AppShell>
  );
}
