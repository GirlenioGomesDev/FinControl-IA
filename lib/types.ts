export type Expense = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  paid_at: string;
  payment_method: string;
  notes: string | null;
};

export type Income = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  source: string;
  received_at: string;
  notes: string | null;
};

export type Saving = {
  id: string;
  user_id: string;
  amount: number;
  goal: string;
  saved_at: string;
  notes: string | null;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  due_date: string | null;
  status: string;
};

export type Backup = {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  backed_up_at: string | null;
  status: string;
  pdf_url: string | null;
  csv_url: string | null;
  json_url: string | null;
  drive_folder_url: string | null;
};
