import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinitionDraft } from "../../../lib/nodes/types";
import { carAutoCheckUpToolCapabilities } from "./tool-capabilities";
import { carAutoCheckUpTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-3", "agents", "car-auto-check-up", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeCarAutoCheckUpModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createCarAutoCheckUpDefinition(nodeId: string): AgentDefinitionDraft {
  const model = initializeCarAutoCheckUpModel();
  const realtimeInstructions = readPersonality();
  return {
    nodeId,
    name: "Car Auto Check Up",
    type: "langchain",
    realtimeInstructions,
    agent: createAgent({
      name: randomAgentName("lc-car-auto-check-up"),
      model,
      tools: [...carAutoCheckUpTools],
      systemPrompt: randomSystemPrompt("Car Auto Check Up", realtimeInstructions),
    }),
  };
}

export { carAutoCheckUpToolCapabilities };
