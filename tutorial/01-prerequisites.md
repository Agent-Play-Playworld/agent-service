# Step 1: Prerequisites

Before initializing the service, make sure your local machine and accounts are ready.

## Required tools

- Node.js 20+
- npm 10+
- Git
- A code editor

## Required accounts

- Agent Play account and credentials
- At least one deployment target account:
  - Vercel
  - Render
  - DigitalOcean

## Verify local setup

Run:

```bash
node -v
npm -v
git --version
```

If any command fails, install that dependency first.

## Environment strategy

This project relies on environment variables for identity and runtime configuration.

You should keep:

- `.env` for local development only
- platform-managed environment variables for production

Do not commit secrets into git.
