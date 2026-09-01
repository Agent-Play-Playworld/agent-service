import { isAuthorizedBootstrapRequest } from "../bootstrap-auth";

const UNAUTHORIZED_BOOTSTRAP_ERROR =
  "Unauthorized bootstrap request. Provide ?key=... with a valid key of at least 16 characters.";

export async function handleBootstrapRequest(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedBootstrapRequest(request)) {
      return Response.json(
        {
          ok: false,
          error: UNAUTHORIZED_BOOTSTRAP_ERROR,
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }

  try {
    const { initializeRuntime } = await import("./initialize-runtime");
    const { registeredAgentIds, initializedAgents } = await initializeRuntime();
    return Response.json({
      ok: true,
      state: "ready",
      registeredAgentCount: registeredAgentIds.length,
      registeredAgentIds,
      initializedAgents,
    });
  } catch (_error: unknown) {
    const { getRuntimeStatus } = await import("./initialize-runtime");
    return Response.json(
      {
        ok: false,
        ...getRuntimeStatus(),
      },
      { status: 503 }
    );
  }
}
