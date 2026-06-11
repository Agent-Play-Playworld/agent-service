# agent-service

`agent-service` is a multi-agent runtime for building and launching customer support bots for startups, companies, indie entrepreneurs, and founders.

It is designed for operating many specialized agents in one service, so teams can scale support coverage across onboarding, account questions, troubleshooting, and workflow-specific assistance.

## Full tutorial

For a step-by-step path from initialization to production deployment, see:

- `tutorial/README.md`

## Quick start

1. Install dependencies:
  - `npm install`
2. Prepare local env:
  - `cp .env.example .env`
3. If you skipped bootstrap during initialize:
  - `npx agent-play create-main-node`
  - `npx agent-play create-agent-node` (once or twice)
  - copy values from `~/.agent-play/credentials.json` into `.env`
4. Run:
  - `npm run dev`
5. Verify routes:
  - `http://localhost:3000/`
  - `http://localhost:3000/api/health`
  - `POST http://localhost:3000/api/runtime/bootstrap?key=<AGENT_SERVICE_KEY>` (starts agents/runtime)

## What this service is for

- Running multiple support-focused agents from a single deployable Node service
- Iterating quickly from local testing to production hosting
- Adapting agent roles and instructions to fit different business and customer segments

## Agent architecture

Each main node lives in its own folder under `src/node-x`, with agents inside:

- `src/node-1/agents/interview-help-ai`
- `src/node-1/agents/jompstart-ai`
- `src/node-2/agents/suncture`
- `src/node-2/agents/agent-play-ai`
- `src/node-3/agents/legal-advisory`
- `src/node-3/agents/car-auto-check-up`

Each agent folder keeps that agent's:

- `definition.ts`
- `tools.ts`
- `tool-capabilities.ts`
- `personality.txt`

To add a new agent, duplicate an existing `src/node-x/agents/<agent-name>` folder and register it in that node's `src/node-x/index.ts`. Main nodes are composed in `src/lib/nodes/index.ts`.

Node runtime toggles are controlled in `node-tuning.yaml`:

- `live: true|false` toggles node registration on/off by node key
- `enableP2a: true|false` controls whether node agents register with P2A on/off
- `node-3` defaults to `live: false` until you set `AGENT_PLAY_MAIN_NODE_ID_3`, agent node ids, and passphrases; then set `live: true`.

## Node identity env contract

- `AGENT_PLAY_ROOT_KEY`: root key content (from `.root`) used for node authentication.
- `AGENT_PLAY_MAIN_NODE_ID_1_PASSW`, `AGENT_PLAY_MAIN_NODE_ID_2_PASSW`, `AGENT_PLAY_MAIN_NODE_ID_3_PASSW`: **main node** human passphrases used only to bootstrap the session (`RemotePlayWorld.connect`). Optional per-node override; when unset for a node, `AGENT_SERVICE_PASSW` is used.
- `AGENT_PLAY_AGENT_NODE_ID_<n>_<slot>_PASSW`: **agent node** human passphrases (paired with each `AGENT_PLAY_AGENT_NODE_ID_<n>_<slot>`). Required at runtime for `addAgent`, heartbeat, intercom, and RPC — the SDK sends these as `x-node-passw` / `passwHash` per agent, not the main passphrase.
- `AGENT_SERVICE_PASSW`: fallback main-node passphrase when a per-node main override is not set.
- `AGENT_PLAY_MAIN_NODE_ID_1` / `_2` / `_3`: main node id per logical node.
- `AGENT_PLAY_AGENT_NODE_ID_<n>_<slot>`: agent node ids (`AGENT_PLAY_AGENT_NODE_ID_3_1`, `AGENT_PLAY_AGENT_NODE_ID_3_2`, etc.).
- `AGENT_SERVICE_KEY`: bootstrap endpoint key (minimum 16 characters).

The generated runtime uses env variables for node ids and **dual credentials** (main bootstrap + per-agent runtime); no hardcoded identities are embedded.