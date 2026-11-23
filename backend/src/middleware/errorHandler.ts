import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

// Codes for the 4xx statuses that express.json() can raise.
const HTTP_ERROR_CODES: Record<number, string> = {
  400: "bad_request",
  413: "payload_too_large",
  415: "unsupported_media_type",
};

// Postgres / PostgREST error codes caused by the request itself rather than
// a server fault. Anything not listed here stays a 500.
const DB_ERRORS: Record<
  string,
  { status: number; code: string; message: string }
> = {
  "22P02": {
    status: 400,
    code: "bad_request",
    message: "Invalid value in request.",
  }, // invalid input syntax (e.g. text in a number column)
  "23502": {
    status: 400,
    code: "bad_request",
    message: "Missing required field.",
  }, // not-null violation
  "23514": {
    status: 400,
    code: "bad_request",
    message: "Invalid value in request.",
  }, // check constraint violation
  "23505": {
    status: 409,
    code: "conflict",
    message: "Resource already exists.",
  }, // unique violation
  // NOTE: foreign key violations are 400 for now; could change later (e.g. 404
  // when the referenced row is missing, or 409 when deleting a row still in use).
  "23503": {
    status: 400,
    code: "bad_request",
    message: "Referenced resource does not exist.",
  }, // foreign key violation
  PGRST116: { status: 404, code: "not_found", message: "Not found" }, // .single() matched no rows
  PGRST204: {
    status: 400,
    code: "bad_request",
    message: "Unknown field in request.",
  }, // column does not exist
};

// Turns errors from libraries into AppErrors where the cause is known;
// returns null for anything unexpected.
function toAppError(err: unknown): AppError | null {
  if (err instanceof AppError) {
    return err;
  }
  if (typeof err !== "object" || err === null) {
    return null;
  }

  // express.json() errors (malformed JSON, body too large, ...) carry their
  // own 4xx status and mark client-safe messages with `expose`.
  const httpError = err as {
    status?: unknown;
    expose?: unknown;
    message?: unknown;
  };
  if (
    typeof httpError.status === "number" &&
    httpError.status >= 400 &&
    httpError.status < 500 &&
    httpError.expose === true
  ) {
    return new AppError(
      httpError.status,
      String(httpError.message),
      HTTP_ERROR_CODES[httpError.status] ?? "error",
    );
  }

  // Supabase query errors: objects with a Postgres / PostgREST `code`.
  const dbError = err as { code?: unknown };
  if (typeof dbError.code === "string" && dbError.code in DB_ERRORS) {
    const { status, code, message } = DB_ERRORS[dbError.code];
    return new AppError(status, message, code);
  }

  return null;
}

// Registered last in app.ts. Known errors are sent with their own status and
// code; anything else is an unexpected error and becomes a generic 500.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // If a response has already started, let Express close the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  const appError = toAppError(err);
  if (appError) {
    res.status(appError.statusCode).json({
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.details !== undefined
          ? { details: appError.details }
          : {}),
      },
    });
    return;
  }

  // Only unexpected 5xx errors are logged
  console.error(err);
  res.status(500).json({
    error: { code: "internal_error", message: "Internal server error" },
  });
};
