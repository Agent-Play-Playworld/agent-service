import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { randomAgentName, randomSystemPrompt, requiredEnv } from "../../../lib/nodes/shared";
import type { AgentDefinition } from "../../../lib/nodes/types";
import { jompstartAiToolCapabilities } from "./tool-capabilities";
import { jompstartAiTools } from "./tools";

function readPersonality(): string {
  return readFileSync(
    join(process.cwd(), "src", "node-1", "agents", "jompstart-ai", "personality.txt"),
    "utf8"
  ).trim();
}

export function initializeJompstartAiModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export function createJompstartAiDefinition(nodeId: string): AgentDefinition {
  const model = initializeJompstartAiModel();
  return {
    nodeId,
    name: "Jompstart AI",
    type: "langchain",
    agent: createAgent({
      name: randomAgentName("lc-jompstart-ai"),
      model,
      tools: [...jompstartAiTools],
      systemPrompt: randomSystemPrompt("Jompstart AI", `${readPersonality()}`),
    }),
  };
}

export { jompstartAiToolCapabilities };
