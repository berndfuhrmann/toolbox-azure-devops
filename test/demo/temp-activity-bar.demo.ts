import { DemoTiming } from "./helpers";
import { runDemoSession, clickAzureDevOpsIcon } from "./demoRunner";

/**
 * Temporary Demo: Click Activity Bar Icon
 *
 * This demo demonstrates:
 * 1. Launching VSCode with the extension
 * 2. Clicking on the Azure DevOps icon in the activity bar
 */

runDemoSession("temp-activity-bar", async (window, logger, _controls) => {
  await clickAzureDevOpsIcon(window, logger);

  logger.step("Waiting to show result");
  await DemoTiming.sleep(DemoTiming.LONG);

  logger.step("Demo completed, pausing before stop");
  await DemoTiming.sleep(DemoTiming.MEDIUM);
}).catch((error) => {
  console.error("Demo failed:", error);
  process.exit(1);
});
