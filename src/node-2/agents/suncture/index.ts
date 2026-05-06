import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinition } from "../../../lib/nodes/types";
import { sunctureToolCapabilities } from "./tool-capabilities";
import { sunctureTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-2", "agents", "suncture", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeSunctureModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createSunctureDefinition(nodeId: string): AgentDefinition {
  const model = initializeSunctureModel();
  return {
    nodeId,
    name: "Suncture AI",
    type: "langchain",
    agent: createAgent({
      name: randomAgentName("lc-suncture"),
      model,
      tools: [...sunctureTools],
      systemPrompt: randomSystemPrompt("Suncture", readPersonality()),
    }),
  };
}

export { sunctureToolCapabilities };
