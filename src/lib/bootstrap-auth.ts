export function readServiceKeyFromEnv(): string {
  const serviceKey = process.env.AGENT_SERVICE_KEY?.trim() ?? "";
  if (serviceKey.length < 16) {
    throw new Error("AGENT_SERVICE_KEY must be set and at least 16 characters.");
  }
  return serviceKey;
}

export function isAuthorizedBootstrapRequest(request: Request): boolean {
  const expectedKey = readServiceKeyFromEnv();
  const url = new URL(request.url);
  const providedKey = (url.searchParams.get("key") ?? "").trim();
  if (providedKey.length < 16) {
    return false;
  }
  return providedKey === expectedKey;
}
