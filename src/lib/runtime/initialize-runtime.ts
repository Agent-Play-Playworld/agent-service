import { loadEnv } from "../../load-env";
import { registerAgents } from "../../register-agents";

type RuntimeState = Awaited<ReturnType<typeof registerAgents>>;
type RuntimeMetadata = {
  startedAt: string;
  initializedAt: string | null;
  environment: string;
  service: string;
};
type RuntimeNodeInformation = {
  baseUrl: string | null;
  mainNodeIds: string[];
  agentNodeIds: string[];
};
type RuntimeStatus = {
  state: "idle" | "initializing" | "ready" | "error";
  message: string | null;
  metadata: RuntimeMetadata;
  nodes: RuntimeNodeInformation;
  agents: {
    registeredAgentIds: string[];
    initializedAgents: RuntimeState["initializedAgents"];
  };
};

let runtimeStatePromise: Promise<RuntimeState> | undefined;
const startedAt = new Date().toISOString();
let runtimeStatus: RuntimeStatus = {
  state: "idle",
  message: null,
  metadata: {
    startedAt,
    initializedAt: null,
    environment: process.env.NODE_ENV ?? "development",
    service: "agent-service",
  },
  nodes: {
    baseUrl: process.env.AGENT_PLAY_WEB_UI_URL?.trim() ?? null,
    mainNodeIds: [],
    agentNodeIds: [],
  },
  agents: {
    registeredAgentIds: [],
    initializedAgents: [],
  },
};

export function getRuntimeStatus(): RuntimeStatus {
  runtimeStatus = {
    ...runtimeStatus,
    nodes: getNodeInformation(),
    metadata: {
      ...runtimeStatus.metadata,
      environment: process.env.NODE_ENV ?? "development",
    },
  };
  return runtimeStatus;
}

function getNodeInformation(): RuntimeNodeInformation {
  const mainNodeId1 = process.env.AGENT_PLAY_MAIN_NODE_ID_1?.trim();
  const mainNodeId2 = process.env.AGENT_PLAY_MAIN_NODE_ID_2?.trim();
  const mainNodeIds = [mainNodeId1, mainNodeId2].filter(
    (nodeId): nodeId is string => nodeId !== undefined && nodeId.length > 0
  );
  const node11 = process.env.AGENT_PLAY_AGENT_NODE_ID_1_1?.trim();
  const node12 = process.env.AGENT_PLAY_AGENT_NODE_ID_1_2?.trim();
  const node21 = process.env.AGENT_PLAY_AGENT_NODE_ID_2_1?.trim();
  const node22 = process.env.AGENT_PLAY_AGENT_NODE_ID_2_2?.trim();
  const agentNodeIds = [node11, node12, node21, node22].filter(
    (nodeId): nodeId is string => nodeId !== undefined && nodeId.length > 0
  );
  return {
    baseUrl: process.env.AGENT_PLAY_WEB_UI_URL?.trim() ?? null,
    mainNodeIds,
    agentNodeIds,
  };
}

export function initializeRuntime(): Promise<RuntimeState> {
  if (runtimeStatePromise !== undefined) {
    return runtimeStatePromise;
  }
  loadEnv();
  runtimeStatus = {
    ...runtimeStatus,
    state: "initializing",
    message: null,
    nodes: getNodeInformation(),
  };
  runtimeStatePromise = registerAgents()
    .then((runtimeState) => {
      runtimeStatus = {
        state: "ready",
        message: null,
        metadata: {
          ...runtimeStatus.metadata,
          initializedAt: new Date().toISOString(),
          environment: process.env.NODE_ENV ?? "development",
        },
        nodes: getNodeInformation(),
        agents: {
          registeredAgentIds: runtimeState.registeredAgentIds,
          initializedAgents: runtimeState.initializedAgents,
        },
      };
      return runtimeState;
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      runtimeStatus = {
        ...runtimeStatus,
        state: "error",
        message,
        nodes: getNodeInformation(),
      };
      runtimeStatePromise = undefined;
      throw error;
    });
  return runtimeStatePromise;
}
