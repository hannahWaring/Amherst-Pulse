import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { env } from "./config/env.js";
import { supabaseAdmin } from "./lib/supabase.js";
import { authRouter } from "./routes/auth.js";
import pinRouter from "./routes/pinRoute.js";

export const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const { error } = await supabaseAdmin.from("profiles").select("id").limit(0);
    if (error) {
      throw error;
    }
    res.json({ status: "ok", db: "ok" });
  } catch {
    res.status(503).json({ status: "degraded", db: "unreachable" });
  }
});

app.use("/auth", authRouter);
app.use("/pins", pinRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);
