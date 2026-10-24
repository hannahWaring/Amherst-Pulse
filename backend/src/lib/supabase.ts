import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
<<<<<<< HEAD
import type { Database } from "../types/database.types.js";
=======
import type { Database } from "./database.types.js";

>>>>>>> origin/main
const serverOptions = {
  auth: { autoRefreshToken: false, persistSession: false },
};

// Uses the secret key (sb_secret_...): bypasses RLS and can call auth.admin.*. Server-side only.
export const supabaseAdmin = createClient<Database>(
  env.supabaseUrl,
  env.supabaseSecretKey,
  serverOptions,
);

// Uses the publishable key (sb_publishable_...): for acting as an end user (e.g. password sign-in).
export const supabasePublic = createClient<Database>(
  env.supabaseUrl,
  env.supabasePublishableKey,
  serverOptions,
);

// Supabase auth requires an email, so usernames are mapped onto an
// undeliverable address. No mail is ever sent to it.
export function usernameToEmail(username: string): string {
  return `${username}@${env.authEmailDomain}`;
}
