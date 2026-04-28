# Step 3: Run and verify locally

Now validate your initialization before working on deployment.

## Start dev server

```bash
npm run dev
```

## Verify startup

Confirm the service starts without env validation errors.

If startup fails:

- confirm `.env` exists
- confirm node identity variables are present and non-empty
- confirm your Agent Play credentials are valid

## Recommended local checks

Before deploying, run:

```bash
npm run build
```

If your project includes tests or lint scripts, run them as well.

## Git hygiene before deploy

Make sure:

- `.env` is ignored (it is listed in `.gitignore`)
- no secrets are committed
- your deployment branch reflects tested changes
