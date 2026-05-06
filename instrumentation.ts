const LOG_PREFIX = "[runtime:instrumentation]";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    console.log(`${LOG_PREFIX} skip register for non-node runtime`);
    return;
  }

  console.log(`${LOG_PREFIX} startup begin`);
  const { getRuntimeStatus, initializeRuntime } = await import(
    "./src/lib/runtime/initialize-runtime"
  );
  try {
    const runtimeState = await initializeRuntime();
    console.log(`${LOG_PREFIX} startup success`, {
      registeredAgentCount: runtimeState.registeredAgentIds.length,
      registeredAgentIds: runtimeState.registeredAgentIds,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${LOG_PREFIX} startup failed`, {
      message,
      runtimeStatus: getRuntimeStatus(),
    });
  }
}
