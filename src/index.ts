import express from "express";
import { initializeRuntime } from "./runtime/initialize-runtime";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  return app;
}

export async function startServer(): Promise<void> {
  const port = Number(process.env.PORT ?? "3100");
  const host = process.env.HOST ?? "0.0.0.0";
  const app = createApp();
  const { world, registeredAgentIds } = await initializeRuntime();
  console.log(`Registered ${String(registeredAgentIds.length)} agent(s):`);
  for (const id of registeredAgentIds) {
    console.log(`  - ${id}`);
  }

  app.listen(port, host, () => {
    console.log(`[starter-express] listening on http://${host}:${String(port)}`);
  });

  await world.hold().for(30 * 60);
}

startServer().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});