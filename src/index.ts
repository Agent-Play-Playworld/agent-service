import { startServer } from "./express-server";

void startServer().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
