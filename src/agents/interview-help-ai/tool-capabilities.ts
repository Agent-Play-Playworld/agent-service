import type { ToolCapabilityEntry } from "../types";

function executeChatTool(args: { message?: string }): Record<string, unknown> {
  const message = typeof args.message === "string" ? args.message : "";
  return {
    reply: `Echo from agent-service: ${message}`,
  };
}

function executeAssistInterviewSessionPlan(args: {
  candidateName?: string;
  roleName?: string;
  goalToday?: string;
}): Record<string, unknown> {
  const candidateName =
    typeof args.candidateName === "string" ? args.candidateName.trim() : "";
  const roleName = typeof args.roleName === "string" ? args.roleName.trim() : "";
  const goalToday =
    typeof args.goalToday === "string" ? args.goalToday.trim() : "";

  if (candidateName.length === 0 || roleName.length === 0 || goalToday.length === 0) {
    return {
      ok: false,
      error: "candidateName, roleName, and goalToday are required.",
    };
  }

  return {
    ok: true,
    sessionPlan: {
      candidateName,
      roleName,
      goalToday,
      phases: [
        "Profile and role expectation alignment",
        "Targeted preparation strategy",
        "Mock interview simulation",
        "Feedback and pass-focused improvement plan",
      ],
    },
  };
}

export const interviewHelpAiToolCapabilities: ToolCapabilityEntry[] = [
  {
    toolName: "chat_tool",
    handler: (args) => executeChatTool({ message: String(args.message ?? "") }),
  },
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
