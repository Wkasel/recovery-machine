import { IUser as CoreUser } from "@/core/types";
import { Database as DatabaseGenerated } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type DbClient = SupabaseClient<Database>;

export type { CoreUser as IUser };

export interface IProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  updated_at: string;
}

export interface IOrganization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
