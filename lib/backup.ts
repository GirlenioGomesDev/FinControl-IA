import { subMonths, startOfMonth, lastDayOfMonth } from "date-fns";
import { createSign } from "crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { backupJson, financialCsv, periodFileName } from "@/lib/exporters";

type UploadResult = {
  pdf_url: string;
  csv_url: string;
  json_url: string;
  drive_folder_url: string;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function googleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = base64url(signer.sign(process.env.GOOGLE_DRIVE_PRIVATE_KEY!.replace(/\\n/g, "\n")));

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`
    })
  });

  if (!response.ok) throw new Error("Google Drive authentication failed");
  const data = await response.json();
  return data.access_token as string;
}

async function createFolder(token: string, name: string, parent?: string) {
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      parents: parent ? [parent] : undefined,
      mimeType: "application/vnd.google-apps.folder"
    })
  });
  if (!response.ok) throw new Error(`Could not create Drive folder ${name}`);
  const data = await response.json();
  return data.id as string;
}

async function uploadFile(token: string, parent: string, file: { name: string; mimeType: string; content: string }) {
  const boundary = `fincontrol_${Date.now()}`;
  const body = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify({ name: file.name, parents: [parent] }),
    `--${boundary}`,
    `Content-Type: ${file.mimeType}`,
    "",
    file.content,
    `--${boundary}--`
  ].join("\r\n");

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body
  });
  if (!response.ok) throw new Error(`Could not upload ${file.name}`);
  const data = await response.json();
  return data.webViewLink as string;
}

async function uploadToGoogleDrive(files: { name: string; mimeType: string; content: string }[], periodStart: Date): Promise<UploadResult> {
  if (!process.env.GOOGLE_DRIVE_CLIENT_EMAIL || !process.env.GOOGLE_DRIVE_PRIVATE_KEY) {
    const names = files.map((file) => file.name).join(", ");
    return {
      pdf_url: `not-configured:${names}`,
      csv_url: `not-configured:${names}`,
      json_url: `not-configured:${names}`,
      drive_folder_url: "not-configured:google-drive"
    };
  }

  const token = await googleAccessToken();
  const root = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || await createFolder(token, "FinControl-IA");
  const year = await createFolder(token, String(periodStart.getFullYear()), root);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(periodStart);
  const month = await createFolder(token, monthName[0].toUpperCase() + monthName.slice(1), year);
  const uploaded = await Promise.all(files.map((file) => uploadFile(token, month, file)));

  return {
    pdf_url: uploaded[0] || "",
    csv_url: uploaded[1] || "",
    json_url: uploaded[2] || "",
    drive_folder_url: `https://drive.google.com/drive/folders/${month}`
  };
}

export async function runQuarterlyBackup() {
  const supabase = createServiceSupabaseClient();
  const periodStart = startOfMonth(subMonths(new Date(), 3));
  const periodEnd = lastDayOfMonth(periodStart);
  const from = periodStart.toISOString().slice(0, 10);
  const to = periodEnd.toISOString().slice(0, 10);

  const { data: profiles } = await supabase.from("profiles").select("id");
  const results = [];

  for (const profile of profiles || []) {
    const [expenses, incomes, savings] = await Promise.all([
      supabase.from("expenses").select("*").eq("user_id", profile.id).gte("paid_at", from).lte("paid_at", to),
      supabase.from("incomes").select("*").eq("user_id", profile.id).gte("received_at", from).lte("received_at", to),
      supabase.from("savings").select("*").eq("user_id", profile.id).gte("saved_at", from).lte("saved_at", to)
    ]);

    const csv = financialCsv(expenses.data || [], incomes.data || [], savings.data || []);
    const json = backupJson(expenses.data || [], incomes.data || [], savings.data || []);
    const pdf = `FinControl IA\nRelatorio ${from} a ${to}\n\nCSV e JSON anexos contem os dados detalhados.`;

    const upload = await uploadToGoogleDrive([
      { name: periodFileName("relatorio", periodStart, "pdf"), mimeType: "application/pdf", content: pdf },
      { name: periodFileName("dados", periodStart, "csv"), mimeType: "text/csv", content: csv },
      { name: periodFileName("backup", periodStart, "json"), mimeType: "application/json", content: json }
    ], periodStart);

    const { data: backup, error } = await supabase.from("backups").insert({
      user_id: profile.id,
      period_start: from,
      period_end: to,
      status: "confirmed",
      backed_up_at: new Date().toISOString(),
      ...upload
    }).select().single();

    if (!error && backup) {
      await Promise.all([
        supabase.from("expenses").delete().eq("user_id", profile.id).gte("paid_at", from).lte("paid_at", to),
        supabase.from("incomes").delete().eq("user_id", profile.id).gte("received_at", from).lte("received_at", to),
        supabase.from("savings").delete().eq("user_id", profile.id).gte("saved_at", from).lte("saved_at", to)
      ]);
    }

    results.push({ user_id: profile.id, status: error ? "failed" : "confirmed" });
  }

  return { period_start: from, period_end: to, results };
}
