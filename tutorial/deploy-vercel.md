# Step 5A: Deploy to Vercel

Use this path when you want fast managed deployment directly from a Git repository.

## 1) Push project to Git provider

Push your repository to GitHub, GitLab, or Bitbucket.

## 2) Create Vercel project

In Vercel:

1. Click "Add New Project"
2. Import your repository
3. Confirm framework and root directory settings

## 3) Configure environment variables

In Project Settings -> Environment Variables, add the same required variables you use locally.

Apply them to:

- Production
- Preview (optional but recommended)

## 4) Configure build and run behavior

This repository runs as a Next.js app, so Vercel can auto-detect framework settings.

In Project Settings:

- Framework Preset: `Next.js`
- Build command: `npm run build` (default)
- Install command: `npm install` (default)
- Output Directory: leave empty (Next.js default)

Runtime behavior note: this project initializes the agent runtime via `POST /api/runtime/bootstrap`. Vercel may recycle server instances between requests, so trigger bootstrap per active instance and validate behavior under your expected traffic patterns.

## 5) Deploy and validate

- Trigger deploy from dashboard or push a commit
- Open deployment URL
- Validate startup and core agent behavior
- Review runtime logs in Vercel for any missing env values