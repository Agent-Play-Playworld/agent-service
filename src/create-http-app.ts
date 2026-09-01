import express from "express";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { handleBootstrapRequest } from "./lib/runtime/handle-bootstrap-request";

const sendFetchResponse = async (
  expressResponse: ExpressResponse,
  response: Response
): Promise<void> => {
  expressResponse.status(response.status);
  const contentType = response.headers.get("content-type");
  if (contentType !== null) {
    expressResponse.setHeader("content-type", contentType);
  }
  expressResponse.send(Buffer.from(await response.arrayBuffer()));
};

const toFetchRequest = (expressRequest: ExpressRequest): Request => {
  const host = expressRequest.get("host") ?? "localhost";
  const protocol = expressRequest.protocol || "https";
  return new Request(`${protocol}://${host}${expressRequest.originalUrl}`, {
    method: expressRequest.method,
  });
};

const handleExpressBootstrap = async (
  expressRequest: ExpressRequest,
  expressResponse: ExpressResponse
): Promise<void> => {
  const response = await handleBootstrapRequest(toFetchRequest(expressRequest));
  await sendFetchResponse(expressResponse, response);
};

export function createHttpApp(): express.Express {
  const app = express();

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/health", async (_req, res) => {
    const { getRuntimeStatus } = await import("./lib/runtime/initialize-runtime");
    const runtime = getRuntimeStatus();
    res.json({
      ok: runtime.state === "ready",
      runtime,
    });
  });

  app.all("/runtime/bootstrap", handleExpressBootstrap);
  app.all("/api/runtime/bootstrap", handleExpressBootstrap);

  return app;
}
