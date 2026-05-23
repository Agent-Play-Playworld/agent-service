import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinition } from "../../../lib/nodes/types";
import { legalAdvisoryToolCapabilities } from "./tool-capabilities";
import { legalAdvisoryTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-3", "agents", "legal-advisory", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeLegalAdvisoryModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createLegalAdvisoryDefinition(nodeId: string): AgentDefinition {
  const model = initializeLegalAdvisoryModel();
  const realtimeInstructions = readPersonality();
  return {
    nodeId,
    name: "Legal Advisory",
    type: "langchain",
    realtimeInstructions,
    agent: createAgent({
      name: randomAgentName("lc-legal-advisory"),
      model,
      tools: [...legalAdvisoryTools],
      systemPrompt: randomSystemPrompt("Legal Advisory", realtimeInstructions),
    }),
  };
}

export { legalAdvisoryToolCapabilities };
