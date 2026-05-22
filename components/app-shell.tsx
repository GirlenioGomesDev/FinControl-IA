import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Bot, Coins, DatabaseBackup, Flag, Home, Landmark, PiggyBank, ReceiptText, Settings, TrendingUp, WalletCards } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/gastos", label: "Gastos", icon: ReceiptText },
  { href: "/entradas", label: "Entradas", icon: TrendingUp },
  { href: "/guardado", label: "Guardado", icon: PiggyBank },
  { href: "/metas", label: "Metas", icon: Flag },
  { href: "/relatorios", label: "Relatorios", icon: BarChart3 },
  { href: "/ia-financeira", label: "IA Financeira", icon: Bot },
  { href: "/backups", label: "Backups", icon: DatabaseBackup },
  { href: "/power-bi", label: "Power BI", icon: Landmark },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings }
];

export async function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth/login");

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 z-30 border-b bg-pearl/88 px-4 py-3 backdrop-blur dark:bg-ink/90 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-champagne shadow-glow dark:bg-pearl dark:text-emerald">
              <Coins size={22} />
            </span>
            <span>
              <strong className="block text-lg tracking-wide">FinControl IA</strong>
              <small className="text-xs text-ink/55 dark:text-pearl/55">Executive finance cockpit</small>
            </span>
          </Link>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="group flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/70 transition hover:bg-white/70 hover:text-ink dark:text-pearl/70 dark:hover:bg-white/10 dark:hover:text-pearl">
              <item.icon size={17} className="text-emerald group-hover:text-champagne" />
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logout} className="mt-6 hidden lg:block">
          <button className="w-full rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-white/70 dark:hover:bg-white/10">
            Sair com seguranca
          </button>
        </form>
      </aside>

      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald">Financas pessoais</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink dark:text-pearl">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-sm text-ink/60 dark:text-pearl/60">{subtitle}</p> : null}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <WalletCards className="text-champagne" />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
