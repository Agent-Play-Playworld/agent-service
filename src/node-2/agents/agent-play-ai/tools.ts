import { tool } from "langchain";
import { z } from "zod";

const agentPlayAiChatTool = tool(
  ({ message }: { message: string }) => `agent-play-ai:${message}`,
  {
    name: "chat_tool",
    description: "Chat tool for questions about Agent Play’s 2D interactive world and multi-agent platform.",
    schema: z.object({ message: z.string() }),
  }
);

const assistAgentPlayScenarioTool = tool(
  ({ domain, issue, targetOutcome }: { domain: string; issue: string; targetOutcome: string }) =>
    `agent-play-scenario:${domain}:${issue}:${targetOutcome}`,
  {
    name: "assist_business_system_audit",
    description:
      "Outline how a topic maps onto Agent Play (agents in-world, interactions, multi-agent setup).",
    schema: z.object({
      domain: z.string(),
      issue: z.string(),
      targetOutcome: z.string(),
    }),
  }
);

export const agentPlayAiTools = [agentPlayAiChatTool, assistAgentPlayScenarioTool] as const;
