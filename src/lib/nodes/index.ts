import type { MainNodeRegistration, ToolCapabilityEntry } from "./types";
import { createNode1Registration } from "../../node-1";
import { createNode2Registration } from "../../node-2";
import { createNode3Registration } from "../../node-3";
import { getNodeTuningByKey } from "./node-tuning";

export function getMainNodeRegistrations(): MainNodeRegistration[] {
  const tuningByKey = getNodeTuningByKey();
  const nodeFactories = [
    { key: "node-1", create: createNode1Registration },
    { key: "node-2", create: createNode2Registration },
    { key: "node-3", create: createNode3Registration },
  ] as const;
  const registrations: MainNodeRegistration[] = [];
  for (const nodeFactory of nodeFactories) {
    const nodeTuning = tuningByKey.get(nodeFactory.key);
    const isLive = nodeTuning?.live ?? true;
    if (!isLive) {
      continue;
    }
    const registration = nodeFactory.create();
    registrations.push({
      ...registration,
      enableP2a: nodeTuning?.enableP2a === false ? "off" : "on",
    });
  }
  return registrations;
}

export function getToolCapabilityEntriesForNodes(
  registrations: MainNodeRegistration[]
): ToolCapabilityEntry[] {
  return registrations.flatMap((registration) => registration.toolCapabilities);
}
