import { tool } from "langchain";
import { z } from "zod";

const carAutoCheckUpChatTool = tool(({ message }: { message: string }) => `car-auto-check-up:${message}`, {
  name: "chat_tool",
  description: "Symptoms, maintenance timing, and shop-prep guidance.",
  schema: z.object({ message: z.string() }),
});

const assistVehicleChecklist = tool(
  ({ mileage, symptoms }: { mileage: number; symptoms: string }) =>
    `vehicle-checklist:${String(mileage)}:${symptoms}`,
  {
    name: "assist_vehicle_checklist",
    description: "Pre-visit checklist from mileage and symptoms.",
    schema: z.object({
      mileage: z.number().int().min(0).max(999999),
      symptoms: z.string(),
    }),
  }
);

export const carAutoCheckUpTools = [carAutoCheckUpChatTool, assistVehicleChecklist] as const;
