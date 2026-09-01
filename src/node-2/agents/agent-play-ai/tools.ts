import { tool } from "langchain";
import { z } from "zod";

const agentPlayAiChatTool = tool(
  ({ message }: { message: string }) => `agent-play-ai:${message}`,
  {
    name: "chat_tool",
    description: "Guide to the Play World world and multi-agent workflows.",
    schema: z.object({ message: z.string() }),
  }
);

const assistAgentPlayScenarioTool = tool(
  ({ domain, issue, targetOutcome }: { domain: string; issue: string; targetOutcome: string }) =>
    `agent-play-scenario:${domain}:${issue}:${targetOutcome}`,
  {
    name: "assist_business_system_audit",
    description:
      "Map a problem onto Play World agents, in-world interactions, and multi-agent setup.",
    schema: z.object({
      domain: z.string(),
      issue: z.string(),
      targetOutcome: z.string(),
    }),
  }
);

export const agentPlayAiTools = [agentPlayAiChatTool, assistAgentPlayScenarioTool] as const;
