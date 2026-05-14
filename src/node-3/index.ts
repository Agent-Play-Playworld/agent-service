import { mainNodePassphraseForKey } from "../lib/nodes/main-node-passphrase";
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
  return {
    key: "node-3",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_3"),
    mainNodePassphrase: mainNodePassphraseForKey("node-3"),
    enableP2a: "on",
    agents: [
      createLegalAdvisoryDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_3_1")),
      createCarAutoCheckUpDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_3_2")),
    ],
    toolCapabilities: [...legalAdvisoryToolCapabilities, ...carAutoCheckUpToolCapabilities],
  };
}
