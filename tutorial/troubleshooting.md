# Troubleshooting

Use this guide for common setup and runtime issues.

## Limited or no filesystem access for credentials

In some hosted environments (for example Vercel, Render, or DigitalOcean App Platform), you may not have reliable runtime access to files like:

- `~/.agent-play/credentials.json`
- `.root`

When that happens, load node credentials from environment variables instead.

Required env variables:

- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID_1` / `_2` / `_3`
- `AGENT_PLAY_AGENT_NODE_ID_<n>_<slot>` (for each live agent)
- matching `_PASSW` values for each main and agent node
- `AGENT_SERVICE_KEY`

Notes:

- `AGENT_SERVICE_PASSW` must be the 10-key human passphrase generated during main node initialization.
- Set these values in your platform environment variable settings, not in committed files.

## Running without an Express server

This project includes a non-Express runtime entry in `src/bare-server.ts`.

If you want to run without Express:

1. Update `src/index.ts` to import `startServer` from `./bare-server.js` instead of `./express-server.js`.
2. Start the service using the same command:
  - `npm run dev`
3. Verify logs show agent registration output.

Behavior difference:

- Express mode exposes `/health`.
- Bare mode runs registration and holds the world session without an HTTP server.

