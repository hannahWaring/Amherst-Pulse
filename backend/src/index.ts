import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./lib/db.js";

const server = app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
});

function shutdown() {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
