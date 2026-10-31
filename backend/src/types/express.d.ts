import type { User } from "@supabase/supabase-js";

// Set by the authenticate middleware.
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
