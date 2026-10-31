import type { Session } from "@supabase/supabase-js";
import type { Request, Response } from "express";
import { badRequest, conflict, unauthorized } from "../errors/AppError.js";
import {
  supabaseAdmin,
  supabasePublic,
  usernameToEmail,
} from "../lib/supabase.js";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function authResponse(session: Session, username: string) {
  return {
    user: { id: session.user.id, username },
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  };
}

async function getUsername(userId: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error(`No profile found for user ${userId}`);
  }
  return data.username;
}

export async function signup(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    throw badRequest("username and password are required");
  }

  const email = usernameToEmail(username);
  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (createError) {
    if (
      createError.code === "email_exists" ||
      createError.code === "user_already_exists"
    ) {
      throw conflict("Username is already taken");
    }
    if (
      createError.code === "weak_password" ||
      createError.code === "email_address_invalid"
    ) {
      throw badRequest(createError.message);
    }
    throw createError;
  }

  const userId = created.user.id;
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({ id: userId, username });
  if (profileError) {
    // Don't leave an auth user behind without a profile.
    await supabaseAdmin.auth.admin.deleteUser(userId);
    if (profileError.code === "23505") {
      throw conflict("Username is already taken");
    }
    throw profileError;
  }

  const { data: signedIn, error: signInError } =
    await supabasePublic.auth.signInWithPassword({ email, password });
  if (signInError) {
    throw signInError;
  }

  res.status(201).json(authResponse(signedIn.session, username));
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    throw badRequest("username and password are required");
  }

  const { data, error } = await supabasePublic.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error) {
    if (error.code === "invalid_credentials") {
      throw unauthorized("Invalid username or password");
    }
    throw error;
  }

  res.json(authResponse(data.session, await getUsername(data.user.id)));
}

export async function logout(req: Request, res: Response) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  if (!token) {
    throw unauthorized("Missing bearer token");
  }

  const { error } = await supabaseAdmin.auth.admin.signOut(token, "local");
  if (error) {
    throw unauthorized("Invalid or expired token");
  }

  res.status(204).end();
}

export async function refresh(req: Request, res: Response) {
  const { refresh_token } = req.body ?? {};
  if (!isNonEmptyString(refresh_token)) {
    throw badRequest("refresh_token is required");
  }

  const { data, error } = await supabasePublic.auth.refreshSession({
    refresh_token,
  });
  if (error || !data.session) {
    throw unauthorized("Invalid or expired refresh token");
  }

  res.json(authResponse(data.session, await getUsername(data.session.user.id)));
}
