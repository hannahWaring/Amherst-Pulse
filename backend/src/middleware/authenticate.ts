import { isAuthApiError } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../errors/AppError.js";
import { supabaseAdmin } from "../lib/supabase.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  if (!token) {
    next(unauthorized("Authentication required."));
    return;
  }

  // getUser checks the token with Supabase Auth, so signed-out sessions and
  // deleted users are rejected immediately.
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) {
    // A 4xx from the auth API means the token was rejected; anything else
    // (network failure, Supabase 5xx) is a server-side problem, which the
    // error handler turns into a 500.
    // NOTE: we can change this behavior later if deemed appropriate
    if (
      isAuthApiError(error) &&
      error.status !== undefined &&
      error.status < 500
    ) {
      next(unauthorized("Authentication required."));
      return;
    }
    next(error);
    return;
  }

  req.user = data.user;
  next();
}
