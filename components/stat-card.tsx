import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <Card className="min-h-36 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink/55 dark:text-pearl/55">{title}</p>
          <strong className="mt-3 block text-2xl font-semibold">{value}</strong>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-sm text-ink/55 dark:text-pearl/55">{detail}</p>
    </Card>
  );
}
