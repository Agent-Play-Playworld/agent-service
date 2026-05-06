import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistBusinessSystemAudit(args: {
  domain?: string;
  issue?: string;
  targetOutcome?: string;
}): Record<string, unknown> {
  const domain = typeof args.domain === "string" ? args.domain.trim() : "";
  const issue = typeof args.issue === "string" ? args.issue.trim() : "";
  const targetOutcome = typeof args.targetOutcome === "string" ? args.targetOutcome.trim() : "";
  if (domain.length === 0 || issue.length === 0 || targetOutcome.length === 0) {
    return { ok: false, error: "domain, issue, and targetOutcome are required." };
  }
  return {
    ok: true,
    auditPlan: {
      domain,
      issue,
      targetOutcome,
      actions: ["Map current state", "Identify root constraints", "Define measurable fixes"],
    },
  };
}

export const businessDeveloperToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_business_system_audit",
    handler: (args) =>
      executeAssistBusinessSystemAudit({
        domain: String(args.domain ?? ""),
        issue: String(args.issue ?? ""),
        targetOutcome: String(args.targetOutcome ?? ""),
      }),
  },
];
