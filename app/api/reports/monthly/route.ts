import { NextResponse } from "next/server";
import { getUserFinancialData } from "@/lib/queries";
import { financialCsv } from "@/lib/exporters";

export async function GET() {
  const { expenses, incomes, savings } = await getUserFinancialData();
  const csv = financialCsv(expenses, incomes, savings);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=fincontrol-ia-relatorio-atual.csv"
    }
  });
}
