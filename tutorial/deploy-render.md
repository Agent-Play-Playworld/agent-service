# Step 5B: Deploy to Render

Use this path for a managed always-on web service with straightforward runtime configuration.

## 1) Create a new Web Service

In Render:

1. Click "New +"
2. Select "Web Service"
3. Connect your Git repository

## 2) Configure service settings

Recommended baseline:

- Environment: `Node`
- Build command: `npm install && npm run build`
- Start command: `npm start`

Pick a region close to your users and choose an instance type suitable for your traffic.

## 3) Add environment variables

In the Render service settings, add required production env vars.

Do not use `.env` files in git for production values.

## 4) Deploy

Create the service and let Render run the first build and deploy.

## 5) Validate and monitor

- Open service URL
- Confirm expected responses
- Check Render logs for boot/runtime issues
- Enable health checks and alerts as needed
