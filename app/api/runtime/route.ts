import { NextResponse } from "next/server";
import {
  getRuntimeStatus,
  initializeRuntime,
} from "../../../src/runtime/initialize-runtime";

export async function GET() {
  try {
    const { registeredAgentIds } = await initializeRuntime();
    return NextResponse.json({
      ok: true,
      state: "ready",
      registeredAgentCount: registeredAgentIds.length,
      registeredAgentIds,
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
