# Step 5C: Deploy to DigitalOcean

Use this path with App Platform for managed deployment from your repository.

## 1) Create App Platform app

In DigitalOcean:

1. Go to App Platform
2. Click "Create App"
3. Connect your Git repository

## 2) Configure component

Select your service component and set:

- Type: Web Service
- Source directory: project root (or your app directory)
- Build command: `npm install && npm run build`
- Run command: `npm start`

## 3) Set environment variables

Add required variables in App Settings -> Environment Variables.

Use encrypted values for secrets.

## 4) Choose plan and region

Start with a basic plan, then scale based on observed load.

## 5) Deploy and verify

- Trigger deployment
- Open live app URL
- Validate core agent flow
- Inspect deploy and runtime logs for missing configuration