import {
  langchainRegistration,
  RemotePlayWorld,
  type RegisteredPlayer,
} from "@agent-play/sdk";
import { executeToolCapability } from "../lib/nodes/execute-tool-capability";
import { getMainNodeRegistrations } from "../lib/nodes";
import type { AgentDefinition, MainNodeRegistration } from "../lib/nodes/types";

type RegisterResult = {
  world: RemotePlayWorld;
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

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function registerAgentDefinition(options: {
  world: RemotePlayWorld;
  definition: AgentDefinition;
}): Promise<RegisteredPlayer> {
  return await options.world.addAgent({
    name: options.definition.name,
    type: options.definition.type,
    agent: langchainRegistration(options.definition.agent),
    nodeId: options.definition.nodeId,
    enableP2a: "on",
  });
}

export async function registerBuiltinAgents(): Promise<RegisterResult> {
  const nodeCredentials = {
    rootKey: requiredEnv("AGENT_PLAY_ROOT_KEY"),
    passw: requiredEnv("AGENT_SERVICE_PASSW"), // 10-key passphrase for main node
  };
  const world = new RemotePlayWorld({
    baseUrl: requiredEnv("AGENT_PLAY_WEB_UI_URL"),
    nodeCredentials,
    logging: "on",
  });
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiApiKey !== undefined && openAiApiKey.length > 0) {
    world.initAudio({
      openai: {
        apiKey: openAiApiKey,
      },
    });
  }
  const nodeRegistrations = getMainNodeRegistrations();
  const registeredAgentIds: string[] = [];
  const initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
    mainNodeId: string;
    mainNodeKey: string;
    type: "langchain";
  }[] = [];
  const chatAgentsByPlayerId = new Map<string, unknown>();
  const registeredPlayers: RegisteredPlayer[] = [];

  for (const nodeRegistration of nodeRegistrations) {
    await world.connect({ mainNodeId: nodeRegistration.mainNodeId });
    const firstDefinition = nodeRegistration.agents[0];
    const secondDefinition = nodeRegistration.agents[1];
    if (firstDefinition === undefined || secondDefinition === undefined) {
      throw new Error(`${nodeRegistration.key} must define exactly two agents.`);
    }
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
  }

  world.subscribeIntercomCommands({
    playerIds: registeredPlayers.map((player) => player.id),
    executeTool: executeToolCapability,
    chatAgentsByPlayerId: chatAgentsByPlayerId as Map<string, never>,
  });

  return { world, registeredAgentIds, initializedAgents };
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
