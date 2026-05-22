import { Download, FileSpreadsheet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData } from "@/lib/queries";

export default async function PowerBiPage() {
  const { backups } = await getUserFinancialData();
  return (
    <AppShell title="Power BI" subtitle="Arquivos CSV e Excel compativeis para importacao, modelagem e dashboards externos.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle title="Conexao" subtitle="Use os arquivos CSV/Excel gerados pelos relatorios ou backups trimestrais." />
          <p className="text-sm leading-6 text-ink/70 dark:text-pearl/70">No Power BI Desktop, selecione Obter Dados, escolha Texto/CSV ou Pasta de Trabalho do Excel e importe os arquivos do FinControl IA. Para automacao, conecte a pasta do Google Drive sincronizada.</p>
          <a href="/api/reports/monthly" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-pearl dark:bg-pearl dark:text-ink"><Download size={16} />Baixar CSV atual</a>
        </Card>
        <Card>
          <CardTitle title="Arquivos disponiveis" />
          <div className="space-y-3">
            {backups.map((backup) => (
              <a key={backup.id} href={backup.csv_url || backup.drive_folder_url || "#"} className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-emerald/5">
                <span className="inline-flex items-center gap-2"><FileSpreadsheet size={16} className="text-emerald" />{backup.period_start} a {backup.period_end}</span>
                <span className="text-xs">{backup.status}</span>
              </a>
            ))}
            {!backups.length ? <p className="text-sm text-ink/55 dark:text-pearl/55">Nenhum arquivo historico disponivel ainda.</p> : null}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
