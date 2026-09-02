import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();

test("production Dockerfile runs the Next.js standalone server as a non-root process", () => {
  const dockerfile = readFileSync(join(root, "Dockerfile"), "utf8");

  assert.match(dockerfile, /FROM node:22-bookworm-slim AS build/);
  assert.match(dockerfile, /FROM node:22-bookworm-slim AS runtime/);
  assert.match(dockerfile, /DOCKER_BUILD=1/);
  assert.match(dockerfile, /npm run build/);
  assert.match(dockerfile, /USER node/);
  assert.match(dockerfile, /EXPOSE 3100/);
  assert.match(dockerfile, /HEALTHCHECK/);
  assert.match(dockerfile, /CMD \["node", "server\.js"\]/);
  assert.doesNotMatch(dockerfile, /COPY \.env/);
  assert.doesNotMatch(dockerfile, /npm run dev/);
});

test("Docker ignore list keeps secrets and local artifacts out of the build context", () => {
  const dockerignore = readFileSync(join(root, ".dockerignore"), "utf8");

  assert.match(dockerignore, /^\.env$/m);
  assert.match(dockerignore, /^node_modules$/m);
  assert.match(dockerignore, /^dist$/m);
  assert.equal(existsSync(join(root, ".env.example")), true);
});
