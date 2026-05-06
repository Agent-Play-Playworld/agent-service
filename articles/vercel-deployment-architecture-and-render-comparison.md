# Making `agent-service` Work Reliably on Vercel: Deep Technical Architecture and Render Comparison

This document explains the exact technical changes used to make this repository deploy and run correctly on Vercel, why those changes matter, and how the operational model differs from Render.

It is intentionally implementation-specific to this codebase.

---

## 1) Problem Statement

`agent-service` is not a static web app. It is a runtime-oriented multi-agent orchestration service that:

- creates authenticated `RemotePlayWorld` sessions
- connects main and agent nodes
- registers multiple agents
- subscribes intercom command streams
- optionally enables P2A audio pathways

Traditional "build static output and serve files" assumptions fail for this architecture.

On Vercel, the service must be treated as a Node-backed Next.js runtime with explicit initialization controls, observability, and instance lifecycle awareness.

---

## 2) Core Deployment Pivot: From Static/Process Assumptions to Runtime Bootstrap

The successful Vercel adaptation came from three architectural pivots:

1. Run as a Next.js Node runtime, not static output.
2. Treat runtime initialization as explicit application logic.
3. Make runtime state observable through API endpoints.

In practice, this means:

- `app/api/runtime/bootstrap` triggers/validates initialization paths
- `app/api/health` reports runtime state
- instrumentation startup can initialize eagerly
- runtime status is persisted in-process with lifecycle states

---

## 3) Runtime Initialization Lifecycle (Code-Level)

Runtime lifecycle is centralized in:

- `src/lib/runtime/initialize-runtime.ts`

The module provides:

- a single in-process initialization promise (dedupe)
- state transitions: `idle -> initializing -> ready | error`
- structured metadata (`startedAt`, `initializedAt`, env, nodes, agents)
- rich logs for registration success/failure diagnosis

Key behavior:

- repeated calls during startup share one promise
- failed initialization resets promise to allow retry
- status endpoint can always return current state snapshot

This is critical for Vercel where process lifecycle and request handling can be non-intuitive compared to single-process servers.

---

## 4) Node/Agent Topology and Config-Driven Orchestration

The architecture is node-centric:

- `src/node-1/*`
- `src/node-2/*`
- composed by `src/lib/nodes/index.ts`

Each node contributes:

- main node identity
- exactly two agent definitions
- per-node `enableP2a`
- tool capability registry

Each agent contributes:

- `tools.ts`
- `tool-capabilities.ts`
- `personality.txt`
- `index.ts` definition builder

Operational toggles are externalized in:

- `node-tuning.yaml`

with per-node flags:

- `live` (registration enabled/disabled)
- `enableP2a` (P2A registration mode)

This makes rollout and incident mitigation configuration-driven instead of code-driven.

---

## 5) Securing Bootstrap on Vercel

The bootstrap endpoint is protected with key auth:

- `app/api/runtime/bootstrap/route.ts`
- shared verifier in `src/lib/bootstrap-auth.ts`

Validation model:

- key passed as URL param (`?key=...`)
- validated against `AGENT_SERVICE_KEY`
- minimum length enforced (`>= 16`)

Why this matters on Vercel:

- serverless/public endpoints are easy to probe
- bootstrap is a privileged action (it creates world sessions, registers nodes/agents)
- protecting initialization path prevents unauthorized runtime churn

---

## 6) Realtime/P2A Instruction Behavior

A critical fix for PTT/realtime consistency was explicit realtime instruction wiring during agent registration.

Implementation details:

- agent definitions now carry `realtimeInstructions` (derived from personality context)
- registration path passes that field into the `addAgent` payload
- per-node `enableP2a` controls are honored from `node-tuning.yaml`

This closes the gap where text-mode behavior followed system prompt but PTT behavior drifted due to realtime instruction defaults.

---

## 7) Why This Works on Vercel

Vercel is effective here when the service is treated as:

- a Node runtime app with explicit bootstrap semantics
- stateful initialization per process instance
- config-driven topology with strict visibility

What improved materially:

- deterministic startup lifecycle
- auditable registration flow
- safer operational surface (auth + tuning flags)
- lower friction to isolate failures (`live: false`, `enableP2a: false`)

---

## 8) Vercel vs Render: Practical Technical Differences

### 8.1 Process Model and Lifecycle

**Vercel**

- request-driven runtime behavior
- process/instance lifecycle can be less predictable under varying traffic
- benefits from explicit bootstrap and in-runtime status introspection

**Render**

- closer to an always-on service model (plan-dependent)
- simpler mental model for long-lived runtime loops
- fewer surprises for continuously active subscriptions

### 8.2 Initialization Strategy

**Vercel**

- explicit startup hook + bootstrap endpoint recommended
- idempotent init logic required
- health/status should report state transitions

**Render**

- startup often maps directly to service boot once
- less emphasis on request-triggered bootstrap control
- still requires robust startup validation, but fewer process-shape edge cases

### 8.3 Operational Controls

**Vercel**

- protect bootstrap endpoint aggressively
- prefer externalized toggles (`node-tuning.yaml`) to quickly disable nodes/features
- log with high context because failures can be instance-scoped

**Render**

- similar controls useful, but control plane feel is more server-like
- easier to reason about continuously running worker/service style setups

### 8.4 P2A/Realtimes and Long-Lived Paths

**Vercel**

- must validate behavior carefully under your expected traffic and lifecycle
- explicit realtime instruction wiring is mandatory for consistency

**Render**

- often better fit for persistent, always-hot runtime expectations
- still requires realtime instruction quality, but less lifecycle-induced ambiguity

---

## 9) DX Enhancements That Made the Difference

Developer experience improvements were not cosmetic; they were stability features:

- structured runtime logs (`[runtime:init]`, `[runtime:register]`, `[runtime:instrumentation]`)
- node-level registration logs (main node connect, agent add, intercom subscribe)
- centralized status model for health responses
- endpoint auth extracted into reusable library module

These changes shorten time-to-diagnosis in production significantly.

---

## 10) Recommended Operating Procedure on Vercel

1. Set all required env variables, including `AGENT_SERVICE_KEY`.
2. Verify `node-tuning.yaml` reflects intended `live` and `enableP2a` values.
3. Deploy.
4. Trigger bootstrap with authorized key.
5. Verify `/api/health` state transitions to `ready`.
6. Validate agent registration IDs and intercom subscription logs.
7. For incidents:
   - disable affected node via `live: false`
   - optionally disable P2A via `enableP2a: false`
   - redeploy and re-bootstrap.

---

## 11) Summary

Vercel deployment worked once the service was designed as an explicit runtime orchestration system rather than a passive web app.

The winning pattern was:

- node-centric composition
- config-driven node tuning
- authenticated bootstrap
- explicit realtime instruction payloads
- startup and registration observability

Render remains strong for always-on service semantics, but with this architecture in place, Vercel can be operated reliably and safely for this agent platform.

