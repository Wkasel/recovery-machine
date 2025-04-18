import { User, UserMetadata } from "@supabase/supabase-js";

export interface AuthUser extends User {
  user_metadata: UserMetadata & {
    avatar_url?: string;
    full_name?: string;
  };
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: Error | null;
}
