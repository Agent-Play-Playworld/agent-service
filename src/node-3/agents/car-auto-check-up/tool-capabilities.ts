import { executeChatTool } from "../../../lib/nodes/shared";
import type { ToolCapabilityEntry } from "../../../lib/nodes/types";

function executeAssistVehicleChecklist(args: {
  mileage?: number;
  symptoms?: string;
}): Record<string, unknown> {
  const symptoms = typeof args.symptoms === "string" ? args.symptoms.trim() : "";
  const mileage =
    typeof args.mileage === "number" && Number.isFinite(args.mileage)
      ? Math.max(0, Math.min(999999, Math.floor(args.mileage)))
      : 0;
  if (symptoms.length === 0) {
    return { ok: false, error: "symptoms is required." };
  }
  return {
    ok: true,
    checklist: {
      mileage,
      symptoms,
      items: ["Fluid levels", "Brake feel", "Tire wear pattern", "Stored diagnostic codes"],
    },
  };
}

export const carAutoCheckUpToolCapabilities: ToolCapabilityEntry[] = [
  { toolName: "chat_tool", handler: (args) => executeChatTool({ message: String(args.message ?? "") }) },
  {
    toolName: "assist_vehicle_checklist",
    handler: (args) =>
      executeAssistVehicleChecklist({
        mileage: typeof args.mileage === "number" ? args.mileage : Number(args.mileage ?? 0),
        symptoms: String(args.symptoms ?? ""),
      }),
  },
];
