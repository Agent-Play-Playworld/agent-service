import { NextResponse } from "next/server";
import { getRuntimeStatus } from "../../../src/lib/runtime/initialize-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const runtimeStatus = getRuntimeStatus();
  return NextResponse.json({
    ok: runtimeStatus.state === "ready",
    runtime: runtimeStatus,
  });
}
