# Agent Service in Production: Complete Deployment and RemotePlayWorld Guide

This article is a deep technical guide for developers deploying this `agent-service` project to production. It is designed as a long-form reference you can read end-to-end or use section by section during implementation.

This guide is organized around them:

1. Deploy on Vercel, Render, and DigitalOcean with concrete env/build/start steps.
2. Understand `RemotePlayWorld` deeply, including config options and agent renaming.
3. Build strong operational intuition: naming best practices, instruction best practices, P2A/audio behavior, LangChain relevance, and log interpretation.

---

## Table of Contents

- Section 1 - Deploying on Vercel
- Section 2 - Deploying on Render
- Section 3 - Deploying on DigitalOcean
- RemotePlayWorld deep dive
- Config options and operational implications
- Agent naming and how to rename agents
- Instruction design best practices
- P2A and audio conversations
- What LangChain is and why it matters here
- Log walkthrough and troubleshooting heuristics

---

## Deployment Prerequisites (All Platforms)

Before platform-specific setup, align on a common baseline:

- Node 20+ runtime
- `npm install` and `npm run build` pass locally
- all required env values available outside your local filesystem

This repository currently expects these environment variables:

- `AGENT_PLAY_WEB_UI_URL=https://agent-play.com`
- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID`
- `AGENT_PLAY_AGENT_NODE_ID_1`
- `AGENT_PLAY_AGENT_NODE_ID_2` (optional)
- `OPENAI_API_KEY`
- `P2A_WEBRTC_ENABLED=1` (feature toggle if you want realtime audio path available)

### Why env-driven credentials are non-negotiable in hosted environments

In managed platforms you often cannot depend on reading:

- `~/.agent-play/credentials.json`
- `.root`

at runtime. This repo now constructs `RemotePlayWorldNodeCredentials` from env:

- `rootKey` <- `AGENT_PLAY_ROOT_KEY`
- `passw` <- `AGENT_SERVICE_PASSW`

`AGENT_SERVICE_PASSW` should be the 10-key human passphrase created at main node initialization.

---

## Section 1: Deploy on Vercel

Vercel is fast to onboard and excellent at environment-variable management, but treat runtime behavior carefully for long-lived agent connections.

### 1. Import repository

1. Push code to GitHub/GitLab/Bitbucket.
2. In Vercel, click Add New Project and import the repo.
3. Confirm root directory points to this project.

### 2. Configure env variables

In Project Settings -> Environment Variables, set all required values listed above. Apply to Production and, if needed, Preview.

Critical credentials:

- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID`
- `AGENT_PLAY_AGENT_NODE_ID_1`

Do not commit these into code or checked-in `.env` files.

### 3. Build and start config

Use:

- Install Command: `npm install`
- Build Command: `npm run build`
- Start Command: `npm start`

Current scripts in this repo:

- `npm run build` -> `tsc -p tsconfig.json`
- `npm start` -> `node dist/index.js`

### 4. Validate deployment

After deploy:

- check startup logs for successful session connect
- verify agent registration logs are present
- if using Express mode, verify `/health` responds with `{ ok: true }`

### 5. Vercel fit guidance

If you need predictable, always-on, long-running process behavior, compare Vercel with Render/DigitalOcean and validate platform behavior under idle/warm lifecycle transitions before production cutover.

---

## Section 2: Deploy on Render

Render is often a strong fit for always-on Node services.

### Caveat: service sleep on lower tiers

On lower Render plans, services may sleep after roughly 15-30 minutes of inactivity. For long-running agent workloads, this can interrupt active world sessions and cause reconnect churn.

If you need persistent runtime behavior:

- upgrade to a Render plan that keeps services awake
- or prefer Vercel/DigitalOcean configurations that meet your uptime expectations for long-running agents

### 1. Create service

1. New -> Web Service.
2. Connect repo.
3. Choose branch and region.

### 2. Runtime commands

Set:

- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 3. Env configuration

Set all required variables, especially:

- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`

These replace filesystem-based credential loading.

### 4. Health and observability

- keep `/health` enabled in Express mode
- configure log retention
- alert on boot failures and repeated restarts

### 5. Render production checklist

- first deploy succeeds
- no missing-env boot exceptions
- `connect` and `addAgent` logs appear
- intercom subscription is active

---

## Section 3: Deploy on DigitalOcean App Platform

DigitalOcean App Platform gives managed deployment with explicit component configuration.

### 1. Create app

1. App Platform -> Create App.
2. Connect repo.
3. Configure Web Service component.

### 2. Build and run steps

- Build: `npm install && npm run build`
- Run: `npm start`

### 3. Env config

Set full env contract including:

- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`

Do not rely on `.root` or `credentials.json` availability in production runtime.

### 4. Scale and operate

Start small, then scale by:

- concurrent conversations
- tool latency
- realtime audio usage
- observed CPU/memory usage

### 5. Verification

- app is reachable
- `/health` works (Express mode)
- session connect succeeds
- agent registration occurs
- intercom commands execute correctly

---

## RemotePlayWorld: Deep Explanation

`RemotePlayWorld` is the core integration point between your Node process and the Agent Play platform. Think of it as your authenticated session and orchestration transport.

What it gives you:

- authenticated session lifecycle
- node identity validation against main node
- agent registration APIs
- optional audio initialization for realtime conversations
- world/intercom subscriptions for command handling

In this repo, runtime setup follows:

1. read required env vars
2. instantiate `RemotePlayWorld` with `baseUrl`, `nodeCredentials`, logging
3. call `world.connect({ mainNodeId })`
4. optionally `world.initAudio(...)` if `OPENAI_API_KEY` exists
5. register agents via `world.addAgent(...)`
6. subscribe commands via `world.subscribeIntercomCommands(...)`

### Config options you should know

- `baseUrl`
  - Endpoint for Agent Play APIs.
  - This repo uses `https://agent-play.com`.
- `nodeCredentials`
  - `{ rootKey, passw }`
  - mandatory for robust hosted environments where FS-based secrets are unavailable.
- `logging`
  - `"on"` enables verbose transport/session traces.
  - excellent during integration; tune for production verbosity as needed.
- `onSessionEvent`
  - optional hook for session lifecycle instrumentation.

### Why this architecture is robust

- fails early on missing credentials (`requiredEnv`)
- keeps identity and credentials explicit
- cleanly separates world wiring from agent definition
- allows deterministic rollout of runtime config via environment variables

---

## How to Rename Agents

There are two names in play:

1. Player/agent display name passed to `world.addAgent({ name })`
2. LangChain agent name passed to `createAgent({ name })`

In this repo, both are generated with random suffixes for uniqueness.

### Where to change names

In `src/builtins/definitions.ts`:

- platform name:
  - `name: randomAgentName("CalculatorAgent")`
  - `name: randomAgentName("PoliceReportAgent")`
- LangChain internal name:
  - `name: randomAgentName("lc-calculator-agent")`
  - `name: randomAgentName("lc-police-report-agent")`

To rename, update those prefixes to domain-meaningful names.

Example naming strategy:

- `PaymentsTriageAgent-prod`
- `IncidentIntakeAgent-emea`
- `KnowledgeRouterAgent-v2`

### Naming best practices

- encode domain responsibility, not implementation details
- include environment or region where useful
- keep names stable for dashboards and incident response
- avoid opaque random-only names in production
- standardize prefixes across teams (`DomainActionAgent`)

---

## Instruction Best Practices (System Prompt Quality)

Model behavior quality depends heavily on instruction quality. This repo already demonstrates strong role prompts, but scaling teams should formalize standards.

### Good instruction traits

- clear role and scope
- explicit output behavior
- explicit ambiguity behavior (ask clarifying questions)
- safety and factual constraints
- tool usage guidance

### Pattern that works

1. Role identity:
  - "You are a police report intake agent..."
2. Behavioral constraints:
  - "Collect factual, time-stamped incident details..."
3. Tool protocol:
  - "Use `chat_tool` for guided conversation and `assist_collect_scene_details` for structured scene data."

### Common mistakes

- vague goals ("be helpful")
- missing ambiguity handling
- conflicting instructions
- overlong prompts with duplicated rules
- no explicit tool usage boundaries

### Practical maintenance approach

- version prompts in source control
- track incident types caused by prompt errors
- tighten prompts incrementally with measurable outcomes

---

## P2A and Audio Conversations

In this repo, audio support is enabled by initializing `world.initAudio` when `OPENAI_API_KEY` exists, and agent registration uses `enableP2a: "on"`.

### Conceptual flow

1. Service initializes world audio capability:
  - `world.initAudio({ openai: { apiKey } })`
2. Agent registration includes:
  - `enableP2a: "on"`
3. Platform can attach realtime credentials for conversation flow.

### What `P2A_WEBRTC_ENABLED=1` means for teams

Treat it as a feature toggle that should be consistent across environments. If audio is expected in production but disabled in staging, debugging becomes confusing.

### Audio rollout best practices

- start with one agent in one environment
- monitor latency and error rates
- confirm fallback behavior for text-only flows
- explicitly document expected voice model and user experience

---

## What LangChain Is and Why It Matters Here

LangChain in this project provides agent construction and tool wiring in a standardized way.

You use:

- `createAgent(...)` to construct model + tools + prompt
- `tool(...)` definitions with schemas (`zod`) for structured capabilities
- `langchainRegistration(...)` to validate/register agent shape for Agent Play

### Why it is important in this architecture

- enforces structured tool contracts
- keeps agent logic composable
- makes capabilities discoverable and reusable
- improves reliability by validating expected `chat_tool` presence

Without this layer, teams often end up with ad-hoc agent glue code that is harder to maintain and reason about.

---

## Understanding the Logs: Deep Walkthrough

Below is your example log flow (simplified in explanation order), with interpretation.

### 1) Env injection

`injected env (8) from .env`

Meaning:

- runtime loaded environment values successfully
- count indicates number of env keys sourced from the file/loader path

Actionable checks:

- verify expected keys are present
- ensure production uses platform env, not local-only assumptions

### 2) Main node validation

`[agent-play] Node identity validated (main).`

Meaning:

- credentials and node identity are valid relative to main node context
- connect pipeline can proceed

If missing:

- suspect wrong `AGENT_PLAY_ROOT_KEY` or `AGENT_SERVICE_PASSW`
- suspect wrong main/agent node IDs mix-up

### 3) Session establishment

`connect:session { sid: ..., apiBase: 'https://agent-play.com' }`
`session:event { name: 'session:connected', detail: { sid: ... } }`

Meaning:

- session ID was assigned
- client has active authenticated session
- API base is confirmed

Operational value:

- correlate all follow-up requests with this `sid` in incident analysis

### 4) Agent node connection details

```
Agent Node Connection
  status   : validated
  nodeId   : ...
  nodeKind : agent
  mainNode : ...
```

Meaning:

- specific agent node identity was validated
- confirms relationship between agent node and main node

### 5) addAgent request payload

This is one of the most useful logs in production triage. It shows:

- request URL (`/api/agent-play/players?sid=...`)
- registered player `name`
- `type: 'langchain'`
- agent tool metadata
- identity fields (`mainNodeId`, `agentId`)
- `enableP2a: 'on'`
- realtime object when audio is active
- realtime instructions

Interpretation tips:

- if `enableP2a` is off unexpectedly, inspect code path and env toggles
- if `realtimeWebrtc` missing, inspect `initAudio` path and API key availability
- if tool metadata looks incomplete, inspect LangChain registration and toolkit exports

### Sensitive data caution

Your sample shows values like password material and client secret redaction. In production:

- avoid printing raw secrets
- redact aggressively in centralized logs
- retain enough metadata for debugging without credential leakage

---

## Troubleshooting Patterns and Fast Diagnosis

### Symptom: startup throws missing env var

Likely cause:

- platform env variable not set

Fix:

- compare platform env set with required list in this article
- redeploy after update

### Symptom: connect fails before addAgent

Likely cause:

- bad root key or passphrase
- node ID mismatch
- wrong base URL

Fix:

- re-check `AGENT_PLAY_ROOT_KEY`, `AGENT_SERVICE_PASSW`, node IDs
- confirm `baseUrl` target

### Symptom: agent registers but no audio conversations

Likely cause:

- `initAudio` not called (missing `OPENAI_API_KEY`)
- `enableP2a` not on for agent registration

Fix:

- verify API key presence
- verify `enableP2a: "on"` path

### Symptom: tools not invoked as expected

Likely cause:

- instruction quality issue
- tool schema mismatch
- wrong mapping in chat-agent subscription map

Fix:

- review system prompts and explicit tool guidance
- verify `tool(...)` schemas and names
- verify player ID to agent mapping in subscription setup

---

## Recommended Production Hardening

- enforce env validation at startup (already done here)
- add structured application-level logs around connect/register/subscribe boundaries
- monitor deployment health with `/health` (Express mode)
- define on-call runbook for credential rotation
- keep agent names stable and meaning-driven
- version prompts and run regression tests for instruction changes

---

## Final Checklist

Before declaring production ready:

- all required env vars configured in target platform
- `npm run build` succeeds in clean CI environment
- session connect succeeds with expected `apiBase`
- all expected agents register
- intercom command path works end-to-end
- audio path verified if P2A is required
- logs are understandable and secrets are redacted

If you follow the above deployment sections and operational practices, you will have a predictable, debuggable, and maintainable agent runtime across Vercel, Render, and DigitalOcean.