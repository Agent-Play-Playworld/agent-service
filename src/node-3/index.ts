import { mainNodePassphraseForKey } from "../lib/nodes/main-node-passphrase";
import { agentNodePassphraseForEnvKey } from "../lib/nodes/agent-node-passphrase";
import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  carAutoCheckUpToolCapabilities,
  createCarAutoCheckUpDefinition,
} from "./agents/car-auto-check-up";
import {
  createLegalAdvisoryDefinition,
  legalAdvisoryToolCapabilities,
} from "./agents/legal-advisory";

export function createNode3Registration(): MainNodeRegistration {
  const agent1IdEnv = "AGENT_PLAY_AGENT_NODE_ID_3_1";
  const agent2IdEnv = "AGENT_PLAY_AGENT_NODE_ID_3_2";
  return {
    key: "node-3",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_3"),
    mainNodePassphrase: mainNodePassphraseForKey("node-3"),
    enableP2a: "on",
    agents: [
      {
        ...createLegalAdvisoryDefinition(requiredEnv(agent1IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent1IdEnv),
      },
      {
        ...createCarAutoCheckUpDefinition(requiredEnv(agent2IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent2IdEnv),
      },
    ],
    toolCapabilities: [...legalAdvisoryToolCapabilities, ...carAutoCheckUpToolCapabilities],
  };
}
