import express, { Application } from "express";
import cors from "cors";
import { config } from "./config/env";
import apiRoutes from "./routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

/**
 * app.ts
 * ------
 * Builds and configures the Express application: middleware, routes,
 * and error handling. Does NOT call app.listen() — that belongs to
 * server.ts, so this file stays importable for future testing without
 * starting a real HTTP server.
 */

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: config.clientUrl,
  })
);

app.use("/api", apiRoutes);

// Must be registered after all real routes.
app.use(notFound);

// Must be registered last: Express recognizes error middleware by its
// four-argument signature.
app.use(errorHandler);

export default app;