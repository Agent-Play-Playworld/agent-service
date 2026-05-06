import express from "express";
import { loadEnv } from "./load-env.js";
import { registerAgents } from "./register-agents.js";

type RuntimeState = Awaited<ReturnType<typeof registerAgents>>;

let runtimeStatePromise: Promise<RuntimeState> | undefined;

function getRuntimeState(): Promise<RuntimeState> {
  if (runtimeStatePromise !== undefined) {
    return runtimeStatePromise;
  }
  loadEnv();
  runtimeStatePromise = registerAgents();
  return runtimeStatePromise;
}

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  return app;
}

export async function initializeRuntime(): Promise<RuntimeState> {
  const runtimeState = await getRuntimeState();
  return runtimeState;
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
