import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinitionDraft } from "../../../lib/nodes/types";
import { interviewHelpAiToolCapabilities } from "./tool-capabilities";
import { interviewHelpAiTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-1", "agents", "interview-help-ai", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeInterviewHelpAiModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createInterviewHelpAiDefinition(nodeId: string): AgentDefinitionDraft {
  const model = initializeInterviewHelpAiModel();
  const realtimeInstructions = readPersonality();
  return {
    nodeId,
    name: "Mink AI",
    type: "langchain",
    realtimeInstructions,
    agent: createAgent({
      name: randomAgentName("lc-mink-ai"),
      model,
      tools: [...interviewHelpAiTools],
      systemPrompt: randomSystemPrompt("Mink AI", realtimeInstructions),
    }),
  };
}

export { interviewHelpAiToolCapabilities };
