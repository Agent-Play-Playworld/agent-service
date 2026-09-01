import { createHttpApp } from "./create-http-app";

const app = createHttpApp();
const port = Number(process.env.PORT ?? "3100");
const host = process.env.HOST ?? "0.0.0.0";

if (process.env.VERCEL !== "1") {
  app.listen(port, host, () => {
    console.log(`[express] listening on http://${host}:${String(port)}`);
  });
}

export default app;
