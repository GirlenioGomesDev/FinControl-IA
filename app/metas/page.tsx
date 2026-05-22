import { AppShell } from "@/components/app-shell";
import { GoalForm, GoalsTable } from "@/components/finance-forms";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData } from "@/lib/queries";

export default async function GoalsPage() {
  const { goals } = await getUserFinancialData();
  return (
    <AppShell title="Metas financeiras" subtitle="Defina objetivos, valor-alvo, valor atual, prazo e status.">
      <div className="space-y-5">
        <Card><CardTitle title="Nova meta" /><GoalForm /></Card>
        <Card><CardTitle title="Metas cadastradas" /><GoalsTable items={goals} /></Card>
      </div>
    </AppShell>
  );
}
