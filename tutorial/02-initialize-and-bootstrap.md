# Step 2: Initialize and bootstrap

Use this step to create and configure agent node identities and connect the scaffold to your environment.

## Install dependencies

From the project root:

```bash
npm install
```

## Create local environment file

```bash
cp .env.example .env
```

## Bootstrap node identities

If you did not run bootstrap during initialize, run:

```bash
npx agent-play create-main-node
npx agent-play create-agent-node
```

Run the second command a second time if you want a second agent node.

## Configure `.env`

Copy credential values from:

`~/.agent-play/credentials.json`

Populate these variables in `.env`:

- `AGENT_PLAY_ROOT_KEY` (value from your `.root` file)
- `AGENT_SERVICE_PASSW` (the 10-key phrase generated during `create-main-node`)
- `AGENT_PLAY_MAIN_NODE_ID`
- `AGENT_PLAY_AGENT_NODE_ID_1`
- `AGENT_PLAY_AGENT_NODE_ID_2` (optional)

## Verify contract

This project expects identity values from env, not hardcoded values.

Check current contract in the root `README.md` under "Node identity env contract".

## Remote deployment note

When deploying to services like Vercel, Render, or DigitalOcean App Platform, direct filesystem access is not guaranteed. In those environments, provide `AGENT_PLAY_ROOT_KEY` and `AGENT_SERVICE_PASSW` through platform environment variables so node credentials can be constructed at runtime.