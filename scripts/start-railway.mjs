import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const wranglerConfig = path.join(projectRoot, "dist/server/wrangler.json");
const wranglerBin = path.join(projectRoot, "node_modules/wrangler/bin/wrangler.js");
const port = process.env.PORT || "8080";

if (!existsSync(wranglerConfig)) {
  console.error("Missing dist/server/wrangler.json. Run `npm run build` before start.");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    "--import",
    "./scripts/sites-env.mjs",
    wranglerBin,
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--local",
    "--persist-to",
    ".wrangler/state",
    "--ip",
    "0.0.0.0",
    "--port",
    port,
    "--inspector-port",
    "0",
  ],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
