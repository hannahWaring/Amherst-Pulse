import { config } from "dotenv";

// Point tests at the local Supabase stack (`npx supabase start`). This runs before
// src/config/env.ts, and "dotenv/config" there doesn't override variables that are
// already set, so .env.test wins over .env.
config({ path: ".env.test", quiet: true });
