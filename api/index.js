import { createApp, initializeRuntime } from "../dist/express-server.js";

const app = createApp();
let runtimeInitialization;

const ensureRuntime = async () => {
  if (runtimeInitialization !== undefined) {
    await runtimeInitialization;
    return;
  }
  runtimeInitialization = initializeRuntime().then(({ registeredAgentIds }) => {
    console.log(
      `[vercel] registered ${String(registeredAgentIds.length)} agent(s)`
    );
  });
  await runtimeInitialization;
};

export default async function handler(req, res) {
  await ensureRuntime();
  return app(req, res);
}
