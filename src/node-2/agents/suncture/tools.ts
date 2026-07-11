import { tool } from "langchain";
import { z } from "zod";

const sunctureChatTool = tool(({ message }: { message: string }) => `suncture:${message}`, {
  name: "chat_tool",
  description: "Health guidance and visit-prep conversations (not diagnosis or prescription).",
  schema: z.object({ message: z.string() }),
});

const assistRelaxationPlan = tool(
  ({ mood, durationMinutes }: { mood: string; durationMinutes: number }) =>
    `relaxation-plan:${mood}:${String(durationMinutes)}`,
  {
    name: "assist_relaxation_plan",
    description: "Short calming routine before continuing health planning.",
    schema: z.object({
      mood: z.string(),
      durationMinutes: z.number().int().min(1).max(60),
    }),
  }
);

export const sunctureTools = [sunctureChatTool, assistRelaxationPlan] as const;
