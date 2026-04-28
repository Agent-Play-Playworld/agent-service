# Step 4: Prepare production config

This step standardizes how your service behaves in production across hosting providers.

## Set production environment variables

Add all required variables from your local `.env` into the target platform's environment variable settings.

At minimum include:

- `AGENT_PLAY_MAIN_NODE_ID`
- `AGENT_PLAY_AGENT_NODE_ID_1`
- `AGENT_PLAY_AGENT_NODE_ID_2` (if used)

Also include any additional credentials your runtime needs.

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