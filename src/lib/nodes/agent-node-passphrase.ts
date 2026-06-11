import { requiredEnv } from "./shared";

export function agentNodePassphraseForEnvKey(agentNodeIdEnvKey: string): string {
  return requiredEnv(`${agentNodeIdEnvKey}_PASSW`);
}
