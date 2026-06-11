import { mainNodePassphraseForKey } from "../lib/nodes/main-node-passphrase";
import { agentNodePassphraseForEnvKey } from "../lib/nodes/agent-node-passphrase";
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
  const agent1IdEnv = "AGENT_PLAY_AGENT_NODE_ID_2_1";
  const agent2IdEnv = "AGENT_PLAY_AGENT_NODE_ID_2_2";
  return {
    key: "node-2",
    mainNodeId: requiredEnv("AGENT_PLAY_MAIN_NODE_ID_2"),
    mainNodePassphrase: mainNodePassphraseForKey("node-2"),
    enableP2a: "on",
    agents: [
      {
        ...createInterviewHelpAiDefinition(requiredEnv(agent1IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent1IdEnv),
      },
      {
        ...createAgentPlayAiDefinition(requiredEnv(agent2IdEnv)),
        passphrase: agentNodePassphraseForEnvKey(agent2IdEnv),
      },
    ],
    toolCapabilities: [...interviewHelpAiToolCapabilities, ...agentPlayAiToolCapabilities],
  };
}
