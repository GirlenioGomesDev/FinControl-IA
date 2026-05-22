import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell title="Configuracoes" subtitle="Preferencias, seguranca e preparacao para integracoes futuras.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle title="Seguranca" subtitle="Autenticacao, sessao e acesso por usuario via Supabase Auth e RLS." />
          <p className="flex items-center gap-2 text-sm text-ink/70 dark:text-pearl/70"><ShieldCheck size={17} className="text-emerald" />Cada tabela financeira usa user_id e politicas que restringem leitura e escrita ao dono.</p>
        </Card>
        <Card>
          <CardTitle title="Integracao bancaria futura" subtitle="Arquitetura preparada, sem conexao real no MVP." />
          <p className="text-sm leading-6 text-ink/70 dark:text-pearl/70">O MVP mantem cadastro manual. Futuras integracoes podem entrar por provedores Open Finance, Pluggy ou Belvo em rotas server-side dedicadas.</p>
        </Card>
      </div>
    </AppShell>
  );
}
