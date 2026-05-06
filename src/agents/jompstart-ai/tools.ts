import { tool } from "langchain";
import { z } from "zod";

const jompstartChatTool = tool(
  ({ message }: { message: string }) => `jompstart:${message}`,
  {
    name: "chat_tool",
    description: "Chat tool for Jompstart AI user support conversations.",
    schema: z.object({
      message: z.string(),
    }),
  }
);

const assistJompstartServiceGuide = tool(
  ({
    question,
    serviceArea,
    userGoal,
  }: {
    question: string;
    serviceArea?: string;
    userGoal?: string;
  }) => `jompstart-guide:${question}:${serviceArea ?? ""}:${userGoal ?? ""}`,
  {
    name: "assist_jompstart_service_guide",
    description:
      "Provide structured Jompstart service guidance from user question and context.",
    schema: z.object({
      question: z.string(),
      serviceArea: z.string().optional(),
      userGoal: z.string().optional(),
    }),
  }
);

export const jompstartAiTools = [jompstartChatTool, assistJompstartServiceGuide] as const;
