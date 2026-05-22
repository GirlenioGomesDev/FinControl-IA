"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money } from "@/lib/utils";

const colors = ["#0e7c66", "#d8b46a", "#6e243d", "#2f4858", "#7f8c6b"];

export function MonthlyChart({ data }: { data: { month: string; gastos: number; entradas: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => money(Number(value))} cursor={{ fill: "rgba(14,124,102,.08)" }} />
          <Bar dataKey="entradas" radius={[6, 6, 0, 0]} fill="#0e7c66" />
          <Bar dataKey="gastos" radius={[6, 6, 0, 0]} fill="#d8b46a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data.length ? data : [{ name: "Sem dados", value: 1 }]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
            {(data.length ? data : [{ name: "Sem dados", value: 1 }]).map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => money(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
