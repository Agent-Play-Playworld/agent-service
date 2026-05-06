import { tool } from "langchain";
import { z } from "zod";

const sunctureChatTool = tool(({ message }: { message: string }) => `suncture:${message}`, {
  name: "chat_tool",
  description: "Chat tool for Suncture mental health support conversations.",
  schema: z.object({ message: z.string() }),
});

const assistRelaxationPlan = tool(
  ({ mood, durationMinutes }: { mood: string; durationMinutes: number }) =>
    `relaxation-plan:${mood}:${String(durationMinutes)}`,
  {
    name: "assist_relaxation_plan",
    description: "Generate a short relaxation support plan.",
    schema: z.object({
      mood: z.string(),
      durationMinutes: z.number().int().min(1).max(60),
    }),
  }
);

export const sunctureTools = [sunctureChatTool, assistRelaxationPlan] as const;
