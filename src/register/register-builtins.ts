import {
  langchainRegistration,
  RemotePlayWorld,
  type RegisteredPlayer,
} from "@agent-play/sdk";
import { getAgentDefinitions } from "../agents";
import { executeToolCapability } from "../agents/execute-tool-capability";
import type { AgentDefinition } from "../agents/types";

type RegisterResult = {
  world: RemotePlayWorld;
  registeredAgentIds: string[];
  initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
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
  const mainNodeId = requiredEnv("AGENT_PLAY_MAIN_NODE_ID");
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
  await world.connect({ mainNodeId });

  const definitions = getAgentDefinitions();
  const registeredAgentIds: string[] = [];
  const initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
    type: "langchain";
  }[] = [];
  const chatAgentsByPlayerId = new Map<string, unknown>();
  const registeredPlayers: RegisteredPlayer[] = [];

  const firstDefinition = definitions[0];
  if (firstDefinition === undefined) {
    throw new Error("At least one agent definition is required.");
  }

  const firstRegistered = await registerAgentDefinition({
    world,
    definition: firstDefinition,
  });
  registeredAgentIds.push(firstRegistered.id);
  initializedAgents.push({
    id: firstRegistered.id,
    name: firstDefinition.name,
    nodeId: firstDefinition.nodeId,
    type: firstDefinition.type,
  });
  registeredPlayers.push(firstRegistered);
  chatAgentsByPlayerId.set(firstRegistered.id, firstDefinition.agent);

  const secondDefinition = definitions[1];
  if (secondDefinition !== undefined) {
    const secondRegistered = await registerAgentDefinition({
      world,
      definition: secondDefinition,
    });
    registeredAgentIds.push(secondRegistered.id);
    initializedAgents.push({
      id: secondRegistered.id,
      name: secondDefinition.name,
      nodeId: secondDefinition.nodeId,
      type: secondDefinition.type,
    });
    registeredPlayers.push(secondRegistered);
    chatAgentsByPlayerId.set(secondRegistered.id, secondDefinition.agent);
  }

  world.subscribeIntercomCommands({
    playerIds: registeredPlayers.map((player) => player.id),
    executeTool: executeToolCapability,
    chatAgentsByPlayerId: chatAgentsByPlayerId as Map<string, never>,
  });

  return { world, registeredAgentIds, initializedAgents };
}
