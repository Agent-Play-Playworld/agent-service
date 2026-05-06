import { tool } from "langchain";
import { z } from "zod";

const interviewHelpChatTool = tool(
  ({ message }: { message: string }) => `interview:${message}`,
  {
    name: "chat_tool",
    description: "Chat tool for Interview Help AI candidate coaching conversations.",
    schema: z.object({
      message: z.string(),
    }),
  }
);

const assistInterviewSessionPlan = tool(
  ({
    candidateName,
    roleName,
    goalToday,
  }: {
    candidateName: string;
    roleName: string;
    goalToday: string;
  }) => `interview-plan:${candidateName}:${roleName}:${goalToday}`,
  {
    name: "assist_interview_session_plan",
    description:
      "Build a focused interview preparation and mock interview plan for the candidate session.",
    schema: z.object({
      candidateName: z.string(),
      roleName: z.string(),
      goalToday: z.string(),
    }),
  }
);

export const interviewHelpAiTools = [
  interviewHelpChatTool,
  assistInterviewSessionPlan,
] as const;
