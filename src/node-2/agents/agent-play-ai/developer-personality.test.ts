import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createAgent = vi.hoisted(() => vi.fn(() => ({ invoke: async () => ({}) })));

vi.mock("langchain", async (importOriginal) => {
  const actual = await importOriginal<typeof import("langchain")>();
  return {
    ...actual,
    createAgent,
  };
});

vi.mock("@langchain/openai", () => ({
  ChatOpenAI: class ChatOpenAI {},
}));

import { createAgentPlayAiDefinition } from "./index.js";

const personalityPath = join(
  process.cwd(),
  "src",
  "node-2",
  "agents",
  "agent-play-ai",
  "personality.txt"
);

describe("agent talk personality", () => {
  beforeEach(() => {
    createAgent.mockClear();
    process.env.OPENAI_API_KEY = "sk-test";
  });

  it("keeps the developer personality as the agent system prompt", () => {
    const personality = readFileSync(personalityPath, "utf8").trim();

    const definition = createAgentPlayAiDefinition("node-play");

    expect(definition.realtimeInstructions).toBe(personality);
    expect(createAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        systemPrompt: personality,
      })
    );
  });
});
