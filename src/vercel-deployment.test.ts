import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  isAuthorizedBootstrapRequest,
  readServiceKeyFromEnv,
} from "./lib/bootstrap-auth";
import {
  getVercelOutputFileTracingIncludes,
  vercelFramework,
  vercelFunctionDynamic,
  vercelFunctionMaxDurationSeconds,
  vercelFunctionRuntime,
  vercelTracedRuntimeFiles,
} from "./lib/runtime/vercel-deployment";

const PROJECT_ROOT = process.cwd();

const RUNTIME_ASSETS = [
  "node-tuning.yaml",
  "src/node-1/agents/interview-help-ai/personality.txt",
  "src/node-1/agents/jompstart-ai/personality.txt",
  "src/node-2/agents/agent-play-ai/personality.txt",
  "src/node-2/agents/suncture/personality.txt",
  "src/node-3/agents/car-auto-check-up/personality.txt",
  "src/node-3/agents/legal-advisory/personality.txt",
] as const;

const getMockBootstrapRequest = (key?: string): Request => {
  const url = new URL("https://agent-service.example/api/runtime/bootstrap");
  if (key !== undefined) {
    url.searchParams.set("key", key);
  }
  return new Request(url, { method: "POST" });
};

const ORIGINAL_SERVICE_KEY = process.env.AGENT_SERVICE_KEY;

afterEach(() => {
  if (ORIGINAL_SERVICE_KEY === undefined) {
    delete process.env.AGENT_SERVICE_KEY;
    return;
  }
  process.env.AGENT_SERVICE_KEY = ORIGINAL_SERVICE_KEY;
});

describe("Vercel deployment contract", () => {
  it("declares Next.js as the Vercel framework and does not use a static public output directory", () => {
    const vercelConfig = JSON.parse(
      readFileSync(join(PROJECT_ROOT, "vercel.json"), "utf8")
    ) as {
      framework?: string;
      outputDirectory?: string;
    };

    expect(vercelFramework).toBe("nextjs");
    expect(vercelConfig.framework).toBe(vercelFramework);
    expect(vercelConfig.outputDirectory).toBeUndefined();
  });

  it("traces node tuning and personality files into serverless function output", () => {
    const nextConfigSource = readFileSync(
      join(PROJECT_ROOT, "next.config.ts"),
      "utf8"
    );
    const tracedFiles = getVercelOutputFileTracingIncludes()["/*"];

    expect(vercelTracedRuntimeFiles).toEqual([
      "./node-tuning.yaml",
      "./src/**/*.txt",
    ]);
    expect(tracedFiles).toEqual([...vercelTracedRuntimeFiles]);
    expect(nextConfigSource).toContain("outputFileTracingIncludes");
    expect(nextConfigSource).toContain("getVercelOutputFileTracingIncludes");
  });

  it("keeps runtime assets at repository-relative paths that Vercel can ship with the function", () => {
    for (const asset of RUNTIME_ASSETS) {
      expect(existsSync(join(PROJECT_ROOT, asset))).toBe(true);
    }
  });

  it("serves health and bootstrap as long-running Node functions rather than Edge or static routes", () => {
    const healthRoute = readFileSync(
      join(PROJECT_ROOT, "app/api/health/route.ts"),
      "utf8"
    );
    const bootstrapRoute = readFileSync(
      join(PROJECT_ROOT, "app/api/runtime/bootstrap/route.ts"),
      "utf8"
    );

    expect(vercelFunctionRuntime).toBe("nodejs");
    expect(vercelFunctionDynamic).toBe("force-dynamic");
    expect(vercelFunctionMaxDurationSeconds).toBeGreaterThanOrEqual(300);
    expect(healthRoute).toContain(`export const runtime = "${vercelFunctionRuntime}"`);
    expect(healthRoute).toContain(`export const dynamic = "${vercelFunctionDynamic}"`);
    expect(healthRoute).toContain(
      `export const maxDuration = ${String(vercelFunctionMaxDurationSeconds)}`
    );
    expect(bootstrapRoute).toContain(`export const runtime = "${vercelFunctionRuntime}"`);
    expect(bootstrapRoute).toContain(`export const dynamic = "${vercelFunctionDynamic}"`);
    expect(bootstrapRoute).toContain(
      `export const maxDuration = ${String(vercelFunctionMaxDurationSeconds)}`
    );
  });
});

describe("Vercel HTTP surface", () => {
  it("rejects bootstrap when the service key is missing from the request", () => {
    process.env.AGENT_SERVICE_KEY = "production-service-key";

    expect(isAuthorizedBootstrapRequest(getMockBootstrapRequest())).toBe(false);
  });

  it("rejects bootstrap when the provided key does not match AGENT_SERVICE_KEY", () => {
    process.env.AGENT_SERVICE_KEY = "production-service-key";

    expect(
      isAuthorizedBootstrapRequest(getMockBootstrapRequest("wrong-service-key"))
    ).toBe(false);
  });

  it("authorizes bootstrap when the request key matches AGENT_SERVICE_KEY", () => {
    process.env.AGENT_SERVICE_KEY = "production-service-key";

    expect(readServiceKeyFromEnv()).toBe("production-service-key");
    expect(
      isAuthorizedBootstrapRequest(
        getMockBootstrapRequest("production-service-key")
      )
    ).toBe(true);
  });
});

describe("runtime assets used on Vercel", () => {
  it("keeps node tuning at the repository-relative yaml path the function will read", () => {
    const tuning = readFileSync(join(PROJECT_ROOT, "node-tuning.yaml"), "utf8");

    expect(tuning).toContain("key: node-1");
    expect(tuning).toContain("key: node-2");
    expect(tuning).toContain("key: node-3");
    expect(tuning).toContain("live: true");
    expect(tuning).toContain("enableP2a: true");
  });
});
