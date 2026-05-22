import { ArrowDownCircle, ArrowUpCircle, Flag, PiggyBank } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CategoryChart, MonthlyChart } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData, summarize } from "@/lib/queries";
import { money, percent } from "@/lib/utils";

export default async function DashboardPage() {
  const data = await getUserFinancialData();
  const summary = summarize(data.expenses, data.incomes, data.savings, data.goals);

  return (
    <AppShell title="Dashboard executivo" subtitle="Visao clara do mes, metas e alertas inteligentes para decisao rapida.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo atual" value={money(summary.balance)} detail="Entradas menos gastos do mes" icon={ArrowUpCircle} />
        <StatCard title="Gastos do mes" value={money(summary.totalExpenses)} detail="Total registrado no periodo atual" icon={ArrowDownCircle} />
        <StatCard title="Entradas/lucros" value={money(summary.totalIncomes)} detail="Receitas e ganhos cadastrados" icon={ArrowUpCircle} />
        <StatCard title="Valor guardado" value={money(summary.totalSaved)} detail={`Metas em ${percent(summary.goalsProgress)}`} icon={PiggyBank} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle title="Grafico mensal" subtitle="Comparativo entre entradas e gastos dos ultimos meses." />
          <MonthlyChart data={summary.monthly} />
        </Card>
        <Card>
          <CardTitle title="Categorias com maiores gastos" subtitle="Onde o dinheiro mais se concentrou este mes." />
          <CategoryChart data={summary.categories} />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle title="Resumo rapido da IA" subtitle="Analise inicial baseada nos registros atuais." />
          <p className="text-sm leading-6 text-ink/70 dark:text-pearl/70">{summary.aiSummary}</p>
        </Card>
        <Card>
          <CardTitle title="Progresso de metas" subtitle="Acompanhamento consolidado das metas financeiras." />
          <div className="h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-pearl/10">
            <div className="h-full rounded-full bg-emerald" style={{ width: `${Math.min(summary.goalsProgress, 100)}%` }} />
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm"><Flag size={16} className="text-champagne" />{percent(summary.goalsProgress)} do valor-alvo total foi alcancado.</p>
        </Card>
      </div>
    </AppShell>
  );
}
