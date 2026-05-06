import { tool } from "langchain";
import { z } from "zod";

const businessDeveloperChatTool = tool(
  ({ message }: { message: string }) => `business-dev:${message}`,
  {
    name: "chat_tool",
    description: "Chat tool for business development support.",
    schema: z.object({ message: z.string() }),
  }
);

const assistBusinessSystemAudit = tool(
  ({ domain, issue, targetOutcome }: { domain: string; issue: string; targetOutcome: string }) =>
    `business-audit:${domain}:${issue}:${targetOutcome}`,
  {
    name: "assist_business_system_audit",
    description: "Create a structured system issue diagnosis and action plan.",
    schema: z.object({
      domain: z.string(),
      issue: z.string(),
      targetOutcome: z.string(),
    }),
  }
);

export const businessDeveloperTools = [businessDeveloperChatTool, assistBusinessSystemAudit] as const;
