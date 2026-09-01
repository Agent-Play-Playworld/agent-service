import { handleBootstrapRequest } from "../../../../src/lib/runtime/handle-bootstrap-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  return handleBootstrapRequest(request);
}

export async function POST(request: Request) {
  return handleBootstrapRequest(request);
}
