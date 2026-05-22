import { AppShell } from "@/components/app-shell";
import { AiChat } from "@/components/ai-chat";
import { Card, CardTitle } from "@/components/ui/card";

export default function AiPage() {
  return (
    <AppShell title="IA Financeira" subtitle="Analise seus dados cadastrados e responda perguntas simples sobre seu comportamento financeiro.">
      <Card>
        <CardTitle title="Converse com a IA" subtitle="Exemplos: Quanto gastei com comida este mes? Qual categoria mais consumiu meu dinheiro? Quanto consegui guardar?" />
        <AiChat />
      </Card>
    </AppShell>
  );
}
