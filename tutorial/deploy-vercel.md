# Step 5A: Deploy to Vercel

Use this path when you want managed Next.js hosting from a Git repository.

This service is a Node-backed Next.js app, not a static site. Vercel must use the Next.js framework preset. Do not set an Output Directory of `public`.

## 1) Push project to Git provider

Push your repository to GitHub, GitLab, or Bitbucket.

## 2) Create Vercel project

In Vercel:

1. Click "Add New Project"
2. Import your repository
3. Confirm these settings:
   - Framework Preset: `Next.js`
   - Root Directory: repository root
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: leave empty
   - Node.js Version: 20 or newer

`vercel.json` in this repository already pins the Next.js framework so Vercel does not treat the build as a static `public` folder.

## 3) Configure environment variables

In Project Settings -> Environment Variables, add the same required variables from `.env.example`.

Apply them to Production and Preview:

- `AGENT_PLAY_WEB_UI_URL`
- `AGENT_PLAY_ROOT_KEY`
- `AGENT_SERVICE_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID_1`
- `AGENT_PLAY_MAIN_NODE_ID_1_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID_2`
- `AGENT_PLAY_MAIN_NODE_ID_2_PASSW`
- `AGENT_PLAY_MAIN_NODE_ID_3`
- `AGENT_PLAY_MAIN_NODE_ID_3_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_1_1`
- `AGENT_PLAY_AGENT_NODE_ID_1_1_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_1_2`
- `AGENT_PLAY_AGENT_NODE_ID_1_2_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_2_1`
- `AGENT_PLAY_AGENT_NODE_ID_2_1_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_2_2`
- `AGENT_PLAY_AGENT_NODE_ID_2_2_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_3_1`
- `AGENT_PLAY_AGENT_NODE_ID_3_1_PASSW`
- `AGENT_PLAY_AGENT_NODE_ID_3_2`
- `AGENT_PLAY_AGENT_NODE_ID_3_2_PASSW`
- `OPENAI_API_KEY`
- `AGENT_SERVICE_KEY` (minimum 16 characters)
- `P2A_WEBRTC_ENABLED`

Do not rely on `~/.agent-play/credentials.json` or `.root` on Vercel. Those files are not available in the function filesystem.

## 4) Build and runtime behavior

This repository is already a Next.js app:

- Framework: Next.js
- Health: `GET /api/health`
- Bootstrap: `POST /api/runtime/bootstrap?key=<AGENT_SERVICE_KEY>`
- Function runtime: Node.js, 300 second max duration
- `node-tuning.yaml` and `src/**/*.txt` personality files are included in the serverless trace

Runtime initialization is per function instance. Vercel may recycle instances, so call bootstrap after deploy and again if `/api/health` reports a state other than `ready`.

Long-lived intercom subscriptions live in process memory. Fluid Compute keeps an instance warm while it has traffic, but idle instances can freeze or recycle. Re-bootstrap after a recycle.

## 5) Deploy and validate

- Trigger deploy from the dashboard or push a commit
- Open the deployment URL
- Confirm `GET /api/health` responds
- Run `POST /api/runtime/bootstrap?key=<AGENT_SERVICE_KEY>`
- Confirm `/api/health` reports `runtime.state` of `ready`
- Review runtime logs for missing env values or registration errors
