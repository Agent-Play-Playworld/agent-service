import {
  langchainRegistration,
  RemotePlayWorld,
  type RegisteredPlayer,
} from "@agent-play/sdk";
import { executeToolCapability } from "../lib/nodes/execute-tool-capability";
import { getMainNodeRegistrations } from "../lib/nodes";
import { requiredEnv } from "../lib/nodes/shared";
import type { AgentDefinition, MainNodeRegistration } from "../lib/nodes/types";

type RegisterResult = {
  worlds: RemotePlayWorld[];
  registeredAgentIds: string[];
  initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
    mainNodeId: string;
    mainNodeKey: string;
    type: "langchain";
  }[];
};

async function registerAgentDefinition(options: {
  world: RemotePlayWorld;
  definition: AgentDefinition;
  enableP2a: "on" | "off";
  mainNodeId: string;
}): Promise<RegisteredPlayer> {
  console.log("[runtime:register] addAgent", {
    agentName: options.definition.name,
    nodeId: options.definition.nodeId,
    mainNodeId: options.mainNodeId,
    enableP2a: options.enableP2a,
  });
  const addAgentInput = {
    name: options.definition.name,
    type: options.definition.type,
    agent: langchainRegistration(options.definition.agent),
    nodeId: options.definition.nodeId,
    mainNodeId: options.mainNodeId,
    agentPassphrase: options.definition.passphrase,
    enableP2a: options.enableP2a,
    realtimeInstructions: options.definition.realtimeInstructions,
  };
  return await (options.world.addAgent as (input: unknown) => Promise<RegisteredPlayer>)(
    addAgentInput
  );
}

export async function registerBuiltinAgents(): Promise<RegisterResult> {
  console.log("[runtime:register] starting agent registration");
  const baseUrl = requiredEnv("AGENT_PLAY_WEB_UI_URL");
  const rootKey = requiredEnv("AGENT_PLAY_ROOT_KEY");
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  const nodeRegistrations = getMainNodeRegistrations();
  console.log("[runtime:register] resolved node registrations", {
    nodeKeys: nodeRegistrations.map((node) => node.key),
    totalNodes: nodeRegistrations.length,
  });
  const registeredAgentIds: string[] = [];
  const initializedAgents: RegisterResult["initializedAgents"] = [];
  const worlds: RemotePlayWorld[] = [];

  for (const nodeRegistration of nodeRegistrations) {
    const world = new RemotePlayWorld({
      baseUrl,
      nodeCredentials: {
        rootKey,
        passw: nodeRegistration.mainNodePassphrase,
      },
      logging: "on",
    });
    if (openAiApiKey !== undefined && openAiApiKey.length > 0) {
      console.log("[runtime:register] enabling audio path", { nodeKey: nodeRegistration.key });
      world.initAudio({
        openai: {
          apiKey: openAiApiKey,
        },
      });
    }
    console.log("[runtime:register] connecting main node", {
      key: nodeRegistration.key,
      mainNodeId: nodeRegistration.mainNodeId,
      enableP2a: nodeRegistration.enableP2a,
    });
    await world.connect({ mainNodeId: nodeRegistration.mainNodeId });
    console.log("[runtime:register] connected main node", {
      mainNodeId: nodeRegistration.mainNodeId,
    });
    const firstDefinition = nodeRegistration.agents[0];
    const secondDefinition = nodeRegistration.agents[1];
    if (firstDefinition === undefined || secondDefinition === undefined) {
      throw new Error(`${nodeRegistration.key} must define exactly two agents.`);
    }
    const chatAgentsByPlayerId = new Map<string, unknown>();
    const registeredPlayers: RegisteredPlayer[] = [];
    await registerNodeAgent({
      world,
      definition: firstDefinition,
      nodeRegistration,
      registeredAgentIds,
      initializedAgents,
      registeredPlayers,
      chatAgentsByPlayerId,
    });
    await registerNodeAgent({
      world,
      definition: secondDefinition,
      nodeRegistration,
      registeredAgentIds,
      initializedAgents,
      registeredPlayers,
      chatAgentsByPlayerId,
    });
    world.subscribeIntercomCommands({
      playerIds: registeredPlayers.map((player) => player.id),
      executeTool: executeToolCapability,
      chatAgentsByPlayerId: chatAgentsByPlayerId as Map<string, never>,
    });
    worlds.push(world);
  }

  console.log("[runtime:register] subscribe intercom complete", {
    worldCount: worlds.length,
    playerCount: registeredAgentIds.length,
    registeredAgentIds,
  });

  return { worlds, registeredAgentIds, initializedAgents };
}

async function registerNodeAgent(options: {
  world: RemotePlayWorld;
  definition: AgentDefinition;
  nodeRegistration: MainNodeRegistration;
  registeredAgentIds: string[];
  initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
    mainNodeId: string;
    mainNodeKey: string;
    type: "langchain";
  }[];
  registeredPlayers: RegisteredPlayer[];
  chatAgentsByPlayerId: Map<string, unknown>;
}): Promise<void> {
  const registered = await registerAgentDefinition({
    world: options.world,
    definition: options.definition,
    enableP2a: options.nodeRegistration.enableP2a,
    mainNodeId: options.nodeRegistration.mainNodeId,
  });

  options.registeredAgentIds.push(registered.id);
  options.initializedAgents.push({
    id: registered.id,
    name: options.definition.name,
    nodeId: options.definition.nodeId,
    mainNodeId: options.nodeRegistration.mainNodeId,
    mainNodeKey: options.nodeRegistration.key,
    type: options.definition.type,
  });
  options.registeredPlayers.push(registered);
  options.chatAgentsByPlayerId.set(registered.id, options.definition.agent);
}
