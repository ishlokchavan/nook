import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MembershipPlan = {
  id: string;
  key: string;
  label: string;
  tagline: string | null;
  price_monthly_aed: number | null;
  price_yearly_aed: number | null;
  billing_cycle: string;
  agent_split_pct: number;
  is_star: boolean;
  is_active: boolean;
  features_json: string[] | null;
  order: number;
  created_at: string;
  updated_at: string;
};
