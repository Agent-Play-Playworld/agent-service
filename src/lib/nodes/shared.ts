export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function randomAgentName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function randomSystemPrompt(prefix: string, rolePrompt: string): string {
  const nonce = Math.random().toString(36).slice(2, 10);
  return `${rolePrompt} Session nonce: ${nonce}. Agent label: ${prefix}.`;
}

export function executeChatTool(args: { message?: string }): Record<string, unknown> {
  const message = typeof args.message === "string" ? args.message : "";
  return {
    reply: `Echo from agent-service: ${message}`,
  };
}
