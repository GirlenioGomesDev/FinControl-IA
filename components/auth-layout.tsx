import { Coins } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthLayout({ mode, title, subtitle }: { mode: "login" | "signup" | "recover"; title: string; subtitle: string }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-md rounded-lg border bg-white/80 p-8 shadow-soft backdrop-blur dark:bg-white/[0.07]">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-champagne dark:bg-pearl dark:text-emerald">
            <Coins />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-emerald">FinControl IA</p>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
        </div>
        <p className="mb-6 text-sm text-ink/60 dark:text-pearl/60">{subtitle}</p>
        <AuthForm mode={mode} />
      </section>
    </main>
  );
}
