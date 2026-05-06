import { initializeRuntime } from "./src/runtime/initialize-runtime";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }
  try {
    const { registeredAgentIds } = await initializeRuntime();
    console.log(
      `[startup] initialized ${String(registeredAgentIds.length)} agent(s)`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[startup] runtime initialization failed: ${message}`);
  }
}
