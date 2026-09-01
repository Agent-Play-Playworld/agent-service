# Step 4: Prepare production config

This step standardizes how your service behaves in production across hosting providers.

## Set production environment variables

Add all required variables from your local `.env` into the target platform's environment variable settings.

At minimum include the variables listed in `.env.example`, especially:

- `AGENT_PLAY_ROOT_KEY` (root key that would normally come from `.root`)
- `AGENT_SERVICE_PASSW` (fallback main-node passphrase)
- `AGENT_PLAY_MAIN_NODE_ID_1` / `_2` / `_3` and matching `_PASSW` values
- `AGENT_PLAY_AGENT_NODE_ID_<n>_<slot>` and matching `_PASSW` values
- `OPENAI_API_KEY`
- `AGENT_SERVICE_KEY` (minimum 16 characters)

Also include any additional credentials your runtime needs.

For remote hosting environments without direct filesystem access, credentials must be loaded through env vars. Do not rely on reading `.root` or local credential files at runtime.

## Build command and start command

Use these defaults unless your app differs:

- Build command: `npm install && npm run build`
- Start command: `npm start`

If the service runs with a custom script, configure that command instead.

## Production checklist

- all required env vars are set
- build succeeds in a clean environment
- logs do not reveal secrets
- health route or startup verification is defined
- rollback plan exists (previous deploy, previous image, or previous release)