import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  createJompstartAiDefinition,
  jompstartAiToolCapabilities,
} from "./agents/jompstart-ai";
import { createSunctureDefinition, sunctureToolCapabilities } from "../node-2/agents/suncture";

export function createNode1Registration(): MainNodeRegistration {
  return {
    key: "node-1",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_1"),
    enableP2a: "on",
    agents: [
      createSunctureDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_1_1")),
      createJompstartAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_1_2")),
    ],
    toolCapabilities: [...sunctureToolCapabilities, ...jompstartAiToolCapabilities],
  };
}
