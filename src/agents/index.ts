import {
  createInterviewHelpAiDefinition,
  initializeInterviewHelpAiModel,
  interviewHelpAiToolCapabilities,
} from "./interview-help-ai";
import {
  createJompstartAiDefinition,
  initializeJompstartAiModel,
  jompstartAiToolCapabilities,
} from "./jompstart-ai";
import type { AgentDefinition, ToolCapabilityEntry } from "./types";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getAgentDefinitions(): AgentDefinition[] {
  const interviewHelpAiModel = initializeInterviewHelpAiModel();
  const definitions: AgentDefinition[] = [
    createInterviewHelpAiDefinition({
      model: interviewHelpAiModel,
      nodeId: requiredEnv("AGENT_PLAY_AGENT_NODE_ID_1"),
    }),
  ];

  const jompstartAiModel = initializeJompstartAiModel();
  definitions.push(
    createJompstartAiDefinition({
      model: jompstartAiModel,
      nodeId: requiredEnv("AGENT_PLAY_AGENT_NODE_ID_2"),
    })
  );

  return definitions;
}

export function getToolCapabilityEntries(): ToolCapabilityEntry[] {
  return [...interviewHelpAiToolCapabilities, ...jompstartAiToolCapabilities];
}
