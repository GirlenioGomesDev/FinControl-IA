import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { getUserFinancialData } from "@/lib/queries";

export default async function BackupsPage() {
  const { backups } = await getUserFinancialData();
  return (
    <AppShell title="Historico de backups" subtitle="Arquivos trimestrais salvos no Google Drive e historico para consulta ou restauracao futura.">
      <Card>
        <CardTitle title="Backups gerados" subtitle="Nada e apagado antes da confirmacao de upload no Drive." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-ink/55 dark:text-pearl/55"><tr><th className="p-3">Periodo</th><th>Status</th><th>Data do backup</th><th>Arquivos</th></tr></thead>
            <tbody className="divide-y">
              {backups.length ? backups.map((backup) => (
                <tr key={backup.id}>
                  <td className="p-3">{backup.period_start} a {backup.period_end}</td>
                  <td className="p-3">{backup.status}</td>
                  <td className="p-3">{backup.backed_up_at || "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {[backup.pdf_url, backup.csv_url, backup.json_url].filter(Boolean).map((url) => (
                        <a key={url} href={url!} className="inline-flex h-9 w-9 items-center justify-center rounded-full border" target="_blank"><ExternalLink size={15} /></a>
                      ))}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={4} className="p-8 text-center text-ink/55 dark:text-pearl/55">Nenhum backup gerado ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
