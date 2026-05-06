import { requiredEnv } from "../lib/nodes/shared";
import type { MainNodeRegistration } from "../lib/nodes/types";
import {
  createInterviewHelpAiDefinition,
  interviewHelpAiToolCapabilities,
} from "../node-1/agents/interview-help-ai";
import {
  businessDeveloperToolCapabilities,
  createBusinessDeveloperDefinition,
} from "./agents/business-developer";

export function createNode2Registration(): MainNodeRegistration {
  return {
    key: "node-2",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_2"),
    enableP2a: "on",
    agents: [
      createInterviewHelpAiDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_2_1")),
      createBusinessDeveloperDefinition(requiredEnv("AGENT_PLAY_AGENT_NODE_ID_2_2")),
    ],
    toolCapabilities: [...interviewHelpAiToolCapabilities, ...businessDeveloperToolCapabilities],
  };
}
