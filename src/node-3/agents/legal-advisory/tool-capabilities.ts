import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistLegalRiskScan(args: {
  topic?: string;
  context?: string;
}): Record<string, unknown> {
  const topic = typeof args.topic === "string" ? args.topic.trim() : "";
  const context = typeof args.context === "string" ? args.context.trim() : "";
  if (topic.length === 0) {
    return { ok: false, error: "topic is required." };
  }
  return {
    ok: true,
    scan: {
      topic,
      context,
      themes: ["Contract scope", "IP ownership", "Liability caps", "Regulatory fit"],
    },
  };
}

export const legalAdvisoryToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_legal_risk_scan",
    handler: (args) =>
      executeAssistLegalRiskScan({
        topic: String(args.topic ?? ""),
        context: String(args.context ?? ""),
      }),
  },
];
