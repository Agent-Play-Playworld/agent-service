import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistJompstartServiceGuide(args: {
  question?: string;
  serviceArea?: string;
  userGoal?: string;
}): Record<string, unknown> {
  const question = typeof args.question === "string" ? args.question.trim() : "";
  const serviceArea = typeof args.serviceArea === "string" ? args.serviceArea.trim() : "";
  const userGoal = typeof args.userGoal === "string" ? args.userGoal.trim() : "";
  if (question.length === 0) {
    return { ok: false, error: "question is required." };
  }
  return {
    ok: true,
    guidanceContext: {
      question,
      serviceArea,
      userGoal,
      companySummary: "Jompstart helps users manage and pay for essential services.",
    },
  };
}

export const jompstartAiToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_jompstart_service_guide",
    handler: (args) =>
      executeAssistJompstartServiceGuide({
        question: String(args.question ?? ""),
        serviceArea: typeof args.serviceArea === "string" ? args.serviceArea : undefined,
        userGoal: typeof args.userGoal === "string" ? args.userGoal : undefined,
      }),
  },
];
