import { ChatOpenAI } from "@langchain/openai";
import { createJompstartAiDefinition } from "./definition";
import { jompstartAiToolCapabilities } from "./tool-capabilities";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function initializeJompstartAiModel(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1",
  });
}

export { createJompstartAiDefinition, jompstartAiToolCapabilities };
