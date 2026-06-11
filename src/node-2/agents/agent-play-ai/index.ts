import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinitionDraft } from "../../../lib/nodes/types";
import { agentPlayAiToolCapabilities } from "./tool-capabilities";
import { agentPlayAiTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-2", "agents", "agent-play-ai", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeAgentPlayAiModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createAgentPlayAiDefinition(nodeId: string): AgentDefinitionDraft {
  const model = initializeAgentPlayAiModel();
  const realtimeInstructions = readPersonality();
  return {
    nodeId,
    name: "Agent Play AI",
    type: "langchain",
    realtimeInstructions,
    agent: createAgent({
      name: randomAgentName("lc-agent-play-ai"),
      model,
      tools: [...agentPlayAiTools],
      systemPrompt: randomSystemPrompt("Agent Play AI", realtimeInstructions),
    }),
  };
}

export { agentPlayAiToolCapabilities };
