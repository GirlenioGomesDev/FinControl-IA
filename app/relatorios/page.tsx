import { Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MonthlyChart, CategoryChart } from "@/components/charts";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData, summarize } from "@/lib/queries";
import { money, monthLabel } from "@/lib/utils";

export default async function ReportsPage() {
  const data = await getUserFinancialData();
  const summary = summarize(data.expenses, data.incomes, data.savings, data.goals);
  return (
    <AppShell title="Relatorios" subtitle="Relatorios mensais e trimestrais com resumo financeiro, graficos, transacoes e analise de IA.">
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle title={`Resumo de ${monthLabel()}`} subtitle="Base para PDF, CSV, Excel e Power BI." />
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p>Total de entradas: <strong>{money(summary.totalIncomes)}</strong></p>
            <p>Total de gastos: <strong>{money(summary.totalExpenses)}</strong></p>
            <p>Saldo final: <strong>{money(summary.balance)}</strong></p>
            <p>Valor guardado: <strong>{money(summary.totalSaved)}</strong></p>
          </div>
          <a href="/api/reports/monthly" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink">
            <Download size={16} />Baixar CSV mensal
          </a>
        </Card>
        <Card>
          <CardTitle title="Analise da IA" />
          <p className="text-sm leading-6 text-ink/70 dark:text-pearl/70">{summary.aiSummary}</p>
        </Card>
        <Card><CardTitle title="Comparativo entre meses" /><MonthlyChart data={summary.monthly} /></Card>
        <Card><CardTitle title="Categorias principais" /><CategoryChart data={summary.categories} /></Card>
      </div>
    </AppShell>
  );
}
