import {
  langchainRegistration,
  RemotePlayWorld,
  type RegisteredPlayer,
} from "@agent-play/sdk";
import { getStarterAgentDefinitions } from "../builtins/definitions";
import { executeToolCapability } from "../tool-handlers/execute-tool-capability";

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

  const hasSecondAgent =
    (process.env.AGENT_PLAY_AGENT_NODE_ID_2?.trim() ?? "").length > 0;
  const definitions = getStarterAgentDefinitions(hasSecondAgent ? 2 : 1);
  const registeredAgentIds: string[] = [];
  const initializedAgents: {
    id: string;
    name: string;
    nodeId: string;
    type: "langchain";
  }[] = [];
  const chatAgentsByPlayerId = new Map<string, unknown>();
  const registeredPlayers: RegisteredPlayer[] = [];
  for (const def of definitions) {
    const registered = await world.addAgent({
      name: def.name,
      type: def.type,
      agent: langchainRegistration(def.agent),
      nodeId: def.nodeId,
      enableP2a: "on",
    });
    registeredAgentIds.push(registered.id);
    initializedAgents.push({
      id: registered.id,
      name: def.name,
      nodeId: def.nodeId,
      type: def.type,
    });
    registeredPlayers.push(registered);
  }
  for (let i = 0; i < registeredPlayers.length; i++) {
    chatAgentsByPlayerId.set(registeredPlayers[i].id, definitions[i].agent);
  }
  world.subscribeIntercomCommands({
    playerIds: registeredPlayers.map((player) => player.id),
    executeTool: executeToolCapability,
    chatAgentsByPlayerId: chatAgentsByPlayerId as Map<string, never>,
  });

  return { world, registeredAgentIds, initializedAgents };
}
