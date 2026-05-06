import { NextResponse } from "next/server";
import {
  getRuntimeStatus,
  initializeRuntime,
} from "../../../../src/lib/runtime/initialize-runtime";

export async function POST() {
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
