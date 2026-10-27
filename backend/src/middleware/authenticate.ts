import { isAuthApiError } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

// TODO: replace the inline responses below with next(error) once the error
// handler middleware is implemented.
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  // getUser checks the token with Supabase Auth, so signed-out sessions and
  // deleted users are rejected immediately.
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) {
    // A 4xx from the auth API means the token was rejected; anything else
    // (network failure, Supabase 5xx) is a server-side problem.
    // NOTE: we can change this behavior later if deemed appropriate
    if (
      isAuthApiError(error) &&
      error.status !== undefined &&
      error.status < 500
    ) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  req.user = data.user;
  next();
}
