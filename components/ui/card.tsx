import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-lg border bg-white/76 p-5 shadow-soft backdrop-blur dark:bg-white/[0.06]", className)}>
      {children}
    </section>
  );
}

export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-ink dark:text-pearl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-ink/55 dark:text-pearl/60">{subtitle}</p> : null}
    </div>
  );
}
