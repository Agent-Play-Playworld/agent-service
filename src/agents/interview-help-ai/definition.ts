import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createAgent } from "langchain";
import type { ChatOpenAI } from "@langchain/openai";
import type { AgentDefinition } from "../types";
import { interviewHelpAiTools } from "./tools";

function randomAgentName(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomSystemPrompt(prefix: string, rolePrompt: string): string {
  const nonce = Math.random().toString(36).slice(2, 10);
  return `${rolePrompt} Session nonce: ${nonce}. Agent label: ${prefix}.`;
}

function getInterviewHelpAiPersonality(): string {
  const filePath = join(
    process.cwd(),
    "src",
    "agents",
    "interview-help-ai",
    "personality.txt"
  );
  return readFileSync(filePath, "utf8").trim();
}

export function createInterviewHelpAiDefinition(options: {
  model: ChatOpenAI;
  nodeId: string;
}): AgentDefinition {
  return {
    nodeId: options.nodeId,
    name: randomAgentName("InterviewHelpAI"),
    type: "langchain",
    agent: createAgent({
      name: randomAgentName("lc-interview-help-ai"),
      model: options.model,
      tools: [...interviewHelpAiTools],
      systemPrompt: randomSystemPrompt(
        "Interview Help AI",
        `${getInterviewHelpAiPersonality()}\n\nAlways start by asking for the candidate name, role they are applying for, and what they want to achieve today before moving to interview coaching. Use chat_tool for conversation and assist_interview_session_plan for structured session planning.`
      ),
    }),
  };
}
