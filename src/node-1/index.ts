import { mainNodePassphraseForKey } from "../lib/nodes/main-node-passphrase";
import { agentNodePassphraseForEnvKey } from "../lib/nodes/agent-node-passphrase";
import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  createJompstartAiDefinition,
  jompstartAiToolCapabilities,
} from "./agents/jompstart-ai";
import { createSunctureDefinition, sunctureToolCapabilities } from "../node-2/agents/suncture";

export function createNode1Registration(): MainNodeRegistration {
  const agent1IdEnv = "AGENT_PLAY_AGENT_NODE_ID_1_1";
  const agent2IdEnv = "AGENT_PLAY_AGENT_NODE_ID_1_2";
  return {
    key: "node-1",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_1"),
    mainNodePassphrase: mainNodePassphraseForKey("node-1"),
    enableP2a: "on",
    agents: [
      {
        ...createSunctureDefinition(requiredEnv(agent1IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent1IdEnv),
      },
      {
        ...createJompstartAiDefinition(requiredEnv(agent2IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent2IdEnv),
      },
    ],
    toolCapabilities: [...sunctureToolCapabilities, ...jompstartAiToolCapabilities],
  };
}
