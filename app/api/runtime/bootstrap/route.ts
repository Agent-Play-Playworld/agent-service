import { NextResponse } from "next/server";
import {
  getRuntimeStatus,
  initializeRuntime,
} from "../../../../src/lib/runtime/initialize-runtime";
import {
  isAuthorizedBootstrapRequest,
  readServiceKeyFromEnv,
} from "../../../../src/lib/bootstrap-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isAuthorizedBootstrapRequest(request)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Unauthorized bootstrap request. Provide ?key=... with a valid key of at least 16 characters.",
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }

  try {
    const { registeredAgentIds, initializedAgents } = await initializeRuntime();
    return NextResponse.json({
      ok: true,
      state: "ready",
      registeredAgentCount: registeredAgentIds.length,
      registeredAgentIds,
      initializedAgents,
    });
  } catch (_error: unknown) {
    const status = getRuntimeStatus();
    return NextResponse.json(
      {
        ok: false,
        ...status,
      },
      { status: 503 }
    );
  }
}
