import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinition } from "../../../lib/nodes/types";
import { businessDeveloperToolCapabilities } from "./tool-capabilities";
import { businessDeveloperTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-2", "agents", "business-developer", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeBusinessDeveloperModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createBusinessDeveloperDefinition(nodeId: string): AgentDefinition {
  const model = initializeBusinessDeveloperModel();
  return {
    nodeId,
    name: "Business Development AI",
    type: "langchain",
    agent: createAgent({
      name: randomAgentName("lc-business-developer"),
      model,
      tools: [...businessDeveloperTools],
      systemPrompt: randomSystemPrompt("Business Developer", readPersonality()),
    }),
  };
}

export { businessDeveloperToolCapabilities };
