import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { handleBootstrapRequest } from "./lib/runtime/handle-bootstrap-request";

const getMockBootstrapRequest = (options: {
  method: "GET" | "POST";
  path?: string;
  key?: string;
}): Request => {
  const path = options.path ?? "/runtime/bootstrap";
  const url = new URL(`https://agents.playworld.world${path}`);
  if (options.key !== undefined) {
    url.searchParams.set("key", options.key);
  }
  return new Request(url, { method: options.method });
};

const ORIGINAL_SERVICE_KEY = process.env.AGENT_SERVICE_KEY;

afterEach(() => {
  if (ORIGINAL_SERVICE_KEY === undefined) {
    delete process.env.AGENT_SERVICE_KEY;
    return;
  }
  process.env.AGENT_SERVICE_KEY = ORIGINAL_SERVICE_KEY;
});

describe("bootstrap HTTP surface", () => {
  it("rejects GET and POST bootstrap without a matching key", async () => {
    process.env.AGENT_SERVICE_KEY = "production-service-key";

    const getResponse = await handleBootstrapRequest(
      getMockBootstrapRequest({ method: "GET" })
    );
    const postResponse = await handleBootstrapRequest(
      getMockBootstrapRequest({ method: "POST" })
    );
    const getBody = (await getResponse.json()) as { ok: boolean; error: string };
    const postBody = (await postResponse.json()) as {
      ok: boolean;
      error: string;
    };

    expect(getResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
    expect(getBody.ok).toBe(false);
    expect(postBody.ok).toBe(false);
  });

  it("exposes bootstrap on the Express paths Vercel is currently serving", () => {
    const expressApp = readFileSync(
      join(process.cwd(), "src/create-http-app.ts"),
      "utf8"
    );
    const nextConfig = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

    expect(expressApp).toContain('app.all("/runtime/bootstrap"');
    expect(expressApp).toContain('app.all("/api/runtime/bootstrap"');
    expect(nextConfig).toContain('source: "/runtime/bootstrap"');
    expect(nextConfig).toContain('destination: "/api/runtime/bootstrap"');
  });
});
