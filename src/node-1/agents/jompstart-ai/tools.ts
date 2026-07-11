import { tool } from "langchain";
import { z } from "zod";

const jompstartChatTool = tool(({ message }: { message: string }) => `jompstart:${message}`, {
  name: "chat_tool",
  description: "Cash flow, budgeting, and payment-priority help.",
  schema: z.object({ message: z.string() }),
});

const assistJompstartServiceGuide = tool(
  ({ question, serviceArea, userGoal }: { question: string; serviceArea?: string; userGoal?: string }) =>
    `jompstart-guide:${question}:${serviceArea ?? ""}:${userGoal ?? ""}`,
  {
    name: "assist_jompstart_service_guide",
    description: "Structured guidance for bills, fees, rent, transport, and savings.",
    schema: z.object({
      question: z.string(),
      serviceArea: z.string().optional(),
      userGoal: z.string().optional(),
    }),
  }
);

export const jompstartAiTools = [jompstartChatTool, assistJompstartServiceGuide] as const;
