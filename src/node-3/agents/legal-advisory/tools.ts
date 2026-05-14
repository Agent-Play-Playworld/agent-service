import { tool } from "langchain";
import { z } from "zod";

const legalAdvisoryChatTool = tool(({ message }: { message: string }) => `legal-advisory:${message}`, {
  name: "chat_tool",
  description: "Chat tool for legal advisory conversations.",
  schema: z.object({ message: z.string() }),
});

const assistLegalRiskScan = tool(
  ({ topic, context }: { topic: string; context: string }) =>
    `legal-risk-scan:${topic}:${context}`,
  {
    name: "assist_legal_risk_scan",
    description: "Surface high-level legal risk themes to discuss with qualified counsel.",
    schema: z.object({
      topic: z.string(),
      context: z.string(),
    }),
  }
);

export const legalAdvisoryTools = [legalAdvisoryChatTool, assistLegalRiskScan] as const;
