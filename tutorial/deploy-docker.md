# Step 5E: Build and run with Docker

The production image builds Next.js in `standalone` mode and runs `node server.js` as a long-lived process. That keeps agent sessions alive the same way a VM or Azure Web App would.

## Build

```bash
docker build -t agent-service .
```

Or:

```bash
docker compose build
```

## Run

Do not bake `.env` into the image. Compose reads it at run time:

```bash
docker compose up
```

Without Compose:

```bash
docker run --rm -p 3100:3100 --env-file .env -e HOSTNAME=0.0.0.0 -e PORT=3100 agent-service
```

## Health

```bash
curl http://localhost:3100/health
curl -X POST "http://localhost:3100/api/runtime/bootstrap?key=<AGENT_SERVICE_KEY>"
```

The image healthcheck waits up to 180 seconds for boot.

## Deploy

Push one replica only. Extra containers would register the same node IDs twice.

```bash
docker build -t <registry>/agent-service:latest .
docker push <registry>/agent-service:latest
```
