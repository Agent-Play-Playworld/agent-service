import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

type NodeTuningEntry = {
  key: string;
  live?: boolean;
  enableP2a?: boolean;
};

type NodeTuningFile = {
  nodes?: NodeTuningEntry[];
};

const defaultNodeTuning = {
  live: true,
  enableP2a: true,
};

export function getNodeTuningByKey(): Map<string, { live: boolean; enableP2a: boolean }> {
  const tuningFilePath = join(process.cwd(), "node-tuning.yaml");
  const fileContents = readFileSync(tuningFilePath, "utf8");
  const parsed = parse(fileContents) as NodeTuningFile;
  const entries = Array.isArray(parsed.nodes) ? parsed.nodes : [];
  const byKey = new Map<string, { live: boolean; enableP2a: boolean }>();
  for (const entry of entries) {
    if (typeof entry.key !== "string" || entry.key.trim().length === 0) {
      continue;
    }
    byKey.set(entry.key, {
      live: entry.live ?? defaultNodeTuning.live,
      enableP2a: entry.enableP2a ?? defaultNodeTuning.enableP2a,
    });
  }
  return byKey;
}
