import { requiredEnv } from "./shared";

function specificPassphraseEnvName(nodeKey: string): string | null {
  if (nodeKey === "node-1") {
    return "AGENT_PLAY_MAIN_NODE_ID_1_PASSW";
  }
  if (nodeKey === "node-2") {
    return "AGENT_PLAY_MAIN_NODE_ID_2_PASSW";
  }
  if (nodeKey === "node-3") {
    return "AGENT_PLAY_MAIN_NODE_ID_3_PASSW";
  }
  return null;
}

export function mainNodePassphraseForKey(nodeKey: string): string {
  const envName = specificPassphraseEnvName(nodeKey);
  if (envName !== null) {
    const value = process.env[envName]?.trim();
    if (value !== undefined && value.length > 0) {
      return value;
    }
  }
  return requiredEnv("AGENT_SERVICE_PASSW");
}
