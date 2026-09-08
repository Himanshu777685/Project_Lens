import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";

/**
 * server.ts
 * ---------
 * The actual entry point. Responsible for:
 *   1. loading configuration (via config/env.ts, imported above)
 *   2. connecting to MongoDB
 *   3. starting the Express server from app.ts
 *
 * No route definitions live here — that's app.ts's job.
 */

async function start(): Promise<void> {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`[server] ProjectLens API running at http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});