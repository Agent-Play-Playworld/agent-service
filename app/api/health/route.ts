import { NextResponse } from "next/server";
import { getRuntimeStatus } from "../../../src/lib/runtime/initialize-runtime";

export async function GET() {
  const runtime = getRuntimeStatus();
  return NextResponse.json({
    ok: runtime.state === "ready",
    runtime,
  });
}
