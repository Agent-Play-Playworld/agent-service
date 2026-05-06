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
  - `POST http://localhost:3000/api/runtime/bootstrap` (starts agents/runtime)

## What this service is for

- Running multiple support-focused agents from a single deployable Node service
- Iterating quickly from local testing to production hosting
- Adapting agent roles and instructions to fit different business and customer segments

## Agent architecture

Each agent lives in its own folder under `src/agents`, for example:

- `src/agents/interview-help-ai`
- `src/agents/jompstart-ai`

Each folder keeps that agent's:

- `definition.ts`
- `tools.ts`
- `tool-capabilities.ts`
- `personality.txt`

To add a new agent, duplicate an existing `src/agents/<agent-name>` folder, update its files, and register it in `src/agents/index.ts`.

## Node identity env contract

- `AGENT_PLAY_ROOT_KEY`: root key content (from `.root`) used for node authentication.
- `AGENT_SERVICE_PASSW`: 10-key human passphrase generated at main node initialization.
- `AGENT_PLAY_MAIN_NODE_ID`: main developer node id.
- `AGENT_PLAY_AGENT_NODE_ID_1`: first agent node id.
- `AGENT_PLAY_AGENT_NODE_ID_2`: optional second agent node id.

The generated runtime uses env variables for node ids and node credentials; no hardcoded identities are embedded.