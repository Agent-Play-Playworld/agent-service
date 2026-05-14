import { mainNodePassphraseForKey } from "../lib/nodes/main-node-passphrase";
import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  createInterviewHelpAiDefinition,
  interviewHelpAiToolCapabilities,
} from "../node-1/agents/interview-help-ai";
import {
  agentPlayAiToolCapabilities,
  createAgentPlayAiDefinition,
} from "./agents/agent-play-ai";

export function createNode2Registration(): MainNodeRegistration {
  return {
    key: "node-2",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_2"),
    mainNodePassphrase: mainNodePassphraseForKey("node-2"),
    enableP2a: "on",
    agents: [
      createInterviewHelpAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_2_1")),
      createAgentPlayAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_2_2")),
    ],
    toolCapabilities: [...interviewHelpAiToolCapabilities, ...agentPlayAiToolCapabilities],
  };
}
