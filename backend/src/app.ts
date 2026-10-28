import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { notFound } from "./errors/AppError.js";
import { supabaseAdmin } from "./lib/supabase.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/authRoute.js";
import pinRouter from "./routes/pinRoute.js";

export const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(0);
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

app.use((_req, _res, next) => {
  next(notFound());
});

app.use(errorHandler);
