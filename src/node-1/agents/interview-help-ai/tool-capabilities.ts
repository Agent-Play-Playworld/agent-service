import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistInterviewSessionPlan(args: {
  candidateName?: string;
  roleName?: string;
  goalToday?: string;
}): Record<string, unknown> {
  const candidateName = typeof args.candidateName === "string" ? args.candidateName.trim() : "";
  const roleName = typeof args.roleName === "string" ? args.roleName.trim() : "";
  const goalToday = typeof args.goalToday === "string" ? args.goalToday.trim() : "";

  if (candidateName.length === 0 || roleName.length === 0 || goalToday.length === 0) {
    return { ok: false, error: "candidateName, roleName, and goalToday are required." };
  }

  return {
    ok: true,
    sessionPlan: {
      candidateName,
      roleName,
      goalToday,
      phases: [
        "Role alignment",
        "Preparation strategy",
        "Mock interview",
        "Pass-focused feedback",
      ],
    },
  };
}

export const interviewHelpAiToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_interview_session_plan",
    handler: (args) =>
      executeAssistInterviewSessionPlan({
        candidateName: String(args.candidateName ?? ""),
        roleName: String(args.roleName ?? ""),
        goalToday: String(args.goalToday ?? ""),
      }),
  },
];
