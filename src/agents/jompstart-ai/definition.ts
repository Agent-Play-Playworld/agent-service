import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createAgent } from "langchain";
import type { ChatOpenAI } from "@langchain/openai";
import type { AgentDefinition } from "../types";
import { jompstartAiTools } from "./tools";

function randomAgentName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomSystemPrompt(prefix: string, rolePrompt: string): string {
  const nonce = Math.random().toString(36).slice(2, 10);
  return `${rolePrompt} Session nonce: ${nonce}. Agent label: ${prefix}.`;
}

function getJompstartAiPersonality(): string {
  const filePath = join(
    process.cwd(),
    "src",
    "agents",
    "jompstart-ai",
    "personality.txt"
  );
  return readFileSync(filePath, "utf8").trim();
}

export function createJompstartAiDefinition(options: {
  model: ChatOpenAI;
  nodeId: string;
}): AgentDefinition {
  return {
    nodeId: options.nodeId,
    name: randomAgentName("JompstartAI"),
    type: "langchain",
    agent: createAgent({
      name: randomAgentName("lc-jompstart-ai"),
      model: options.model,
      tools: [...jompstartAiTools],
      systemPrompt: randomSystemPrompt(
        "Jompstart AI",
        `${getJompstartAiPersonality()}\n\nUse chat_tool for user support conversation and assist_jompstart_service_guide to structure answers for Jompstart service questions.`
      ),
    }),
  };
}
