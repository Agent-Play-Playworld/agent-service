import { startServer } from "./express-server.js";

void startServer().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
