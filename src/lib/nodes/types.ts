import type { createAgent } from "langchain";

export type AgentDefinition = {
  nodeId: string;
  passphrase: string;
  name: string;
  type: "langchain";
  agent: ReturnType<typeof createAgent>;
  realtimeInstructions: string;
};

export type AgentDefinitionDraft = Omit<AgentDefinition, "passphrase">;

export type ToolCapabilityHandler = (
  args: Record<string, unknown>
) => Record<string, unknown> | Promise<Record<string, unknown>>;

export type ToolCapabilityEntry = {
  toolName: string;
  handler: ToolCapabilityHandler;
};

export type MainNodeRegistration = {
  key: string;
  mainNodeId: string;
  mainNodePassphrase: string;
  enableP2a: "on" | "off";
  agents: AgentDefinition[];
  toolCapabilities: ToolCapabilityEntry[];
};
