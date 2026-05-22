import { AuthLayout } from "@/components/auth-layout";

export default function LoginPage() {
  return <AuthLayout mode="login" title="Acesso seguro" subtitle="Entre para visualizar seu painel financeiro privado com sessao validada pelo Supabase Auth." />;
}
