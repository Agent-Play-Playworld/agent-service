import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistRelaxationPlan(args: {
  mood?: string;
  durationMinutes?: number;
}): Record<string, unknown> {
  const mood = typeof args.mood === "string" ? args.mood.trim() : "";
  const durationMinutes =
    typeof args.durationMinutes === "number" ? Math.max(1, Math.min(60, args.durationMinutes)) : 10;
  if (mood.length === 0) {
    return { ok: false, error: "mood is required." };
  }
  return {
    ok: true,
    relaxationPlan: {
      mood,
      durationMinutes,
      steps: ["Box breathing", "Body scan", "Gentle reflection"],
    },
  };
}

export const sunctureToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_relaxation_plan",
    handler: (args) =>
      executeAssistRelaxationPlan({
        mood: String(args.mood ?? ""),
        durationMinutes:
          typeof args.durationMinutes === "number" ? args.durationMinutes : Number(args.durationMinutes ?? 10),
      }),
  },
];
