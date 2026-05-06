import { getMainNodeRegistrations, getToolCapabilityEntriesForNodes } from "./index";
import type { ToolCapabilityHandler } from "./types";

function resolveToolCapabilityHandler(toolName: string): ToolCapabilityHandler | null {
  const entries = getToolCapabilityEntriesForNodes(getMainNodeRegistrations());
  for (const entry of entries) {
    if (entry.toolName === toolName) {
      return entry.handler;
    }
  }
  return null;
}

export async function executeToolCapability(options: {
  toolName: string;
  args: Record<string, unknown>;
}): Promise<Record<string, unknown>> {
  const handler = resolveToolCapabilityHandler(options.toolName);
  if (handler === null) {
    throw new Error(`unknown tool capability: ${options.toolName}`);
  }
  return await Promise.resolve(handler(options.args));
}
