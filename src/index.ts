import express from "express";

const app = express();
const port = Number(process.env.PORT ?? "3100");
const host = process.env.HOST ?? "0.0.0.0";

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, host, () => {
  console.log(`[express] listening on http://${host}:${String(port)}`);
});