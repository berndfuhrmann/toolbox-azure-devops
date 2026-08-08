import { spawnSync } from "child_process";
import * as path from "path";

const allDemos = ["add-organization", "temp-activity-bar"];

const requested = process.argv.slice(2);
const demosToRun = requested.length > 0 ? requested : allDemos;

for (const name of demosToRun) {
  const scriptPath = path.join(process.cwd(), "out", "test", "demo", `${name}.demo.js`);
  console.log(`\n=== Recording demo: ${name} ===`);
  const result = spawnSync(process.execPath, [scriptPath], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`Demo "${name}" failed with exit code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}
