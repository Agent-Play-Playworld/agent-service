import { NextResponse } from "next/server";
import {
  getRuntimeStatus,
  initializeRuntime,
} from "../../../src/runtime/initialize-runtime";

export async function GET() {
  const currentStatus = getRuntimeStatus();
  if (currentStatus.state === "idle") {
    try {
      await initializeRuntime();
    } catch (_error: unknown) {
      // Status is tracked by the runtime module and returned below.
    }
  }
  const runtime = getRuntimeStatus();
  return NextResponse.json({
    ok: runtime.state === "ready",
    runtime,
  });
}
