"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const expenseSchema = z.object({
  description: z.string().min(2),
  amount: z.coerce.number().positive(),
  category: z.string().min(2),
  paid_at: z.string().min(8),
  payment_method: z.string().min(2),
  notes: z.string().optional()
});

const incomeSchema = z.object({
  description: z.string().min(2),
  amount: z.coerce.number().positive(),
  source: z.string().min(2),
  received_at: z.string().min(8),
  notes: z.string().optional()
});

const savingSchema = z.object({
  amount: z.coerce.number().positive(),
  goal: z.string().min(2),
  saved_at: z.string().min(8),
  notes: z.string().optional()
});

const goalSchema = z.object({
  name: z.string().min(2),
  target_amount: z.coerce.number().positive(),
  current_amount: z.coerce.number().nonnegative(),
  due_date: z.string().optional(),
  status: z.string().default("ativa")
});

async function userId() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/auth/login");
  return { supabase, user_id: data.user.id };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function createExpense(formData: FormData) {
  const { supabase, user_id } = await userId();
  const payload = expenseSchema.parse(Object.fromEntries(formData));
  await supabase.from("expenses").insert({ ...payload, user_id, notes: payload.notes || null });
  revalidatePath("/gastos");
  revalidatePath("/dashboard");
}

export async function deleteExpense(formData: FormData) {
  const { supabase } = await userId();
  await supabase.from("expenses").delete().eq("id", String(formData.get("id")));
  revalidatePath("/gastos");
  revalidatePath("/dashboard");
}

export async function createIncome(formData: FormData) {
  const { supabase, user_id } = await userId();
  const payload = incomeSchema.parse(Object.fromEntries(formData));
  await supabase.from("incomes").insert({ ...payload, user_id, notes: payload.notes || null });
  revalidatePath("/entradas");
  revalidatePath("/dashboard");
}

export async function deleteIncome(formData: FormData) {
  const { supabase } = await userId();
  await supabase.from("incomes").delete().eq("id", String(formData.get("id")));
  revalidatePath("/entradas");
  revalidatePath("/dashboard");
}

export async function createSaving(formData: FormData) {
  const { supabase, user_id } = await userId();
  const payload = savingSchema.parse(Object.fromEntries(formData));
  await supabase.from("savings").insert({ ...payload, user_id, notes: payload.notes || null });
  revalidatePath("/guardado");
  revalidatePath("/dashboard");
}

export async function deleteSaving(formData: FormData) {
  const { supabase } = await userId();
  await supabase.from("savings").delete().eq("id", String(formData.get("id")));
  revalidatePath("/guardado");
  revalidatePath("/dashboard");
}

export async function createGoal(formData: FormData) {
  const { supabase, user_id } = await userId();
  const payload = goalSchema.parse(Object.fromEntries(formData));
  await supabase.from("goals").insert({ ...payload, user_id, due_date: payload.due_date || null });
  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

export async function deleteGoal(formData: FormData) {
  const { supabase } = await userId();
  await supabase.from("goals").delete().eq("id", String(formData.get("id")));
  revalidatePath("/metas");
  revalidatePath("/dashboard");
}
