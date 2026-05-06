import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  createInterviewHelpAiDefinition,
  interviewHelpAiToolCapabilities,
} from "./agents/interview-help-ai";
import {
  createJompstartAiDefinition,
  jompstartAiToolCapabilities,
} from "./agents/jompstart-ai";

export function createNode1Registration(): MainNodeRegistration {
  return {
    key: "node-1",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_1"),
    agents: [
      createInterviewHelpAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_1_1")),
      createJompstartAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_1_2")),
    ],
    toolCapabilities: [...interviewHelpAiToolCapabilities, ...jompstartAiToolCapabilities],
  };
}
