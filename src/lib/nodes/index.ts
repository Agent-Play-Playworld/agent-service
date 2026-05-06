import type { MainNodeRegistration, ToolCapabilityEntry } from "./types";
import { createNode1Registration } from "../../node-1";
import { createNode2Registration } from "../../node-2";

export function getMainNodeRegistrations(): MainNodeRegistration[] {
  return [createNode1Registration(), createNode2Registration()];
}

export function getToolCapabilityEntriesForNodes(
  registrations: MainNodeRegistration[]
): ToolCapabilityEntry[] {
  return registrations.flatMap((registration) => registration.toolCapabilities);
}
