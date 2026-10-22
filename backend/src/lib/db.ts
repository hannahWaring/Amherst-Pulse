import pg from "pg";
import { env } from "../config/env.js";

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error", err);
});

export function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}
