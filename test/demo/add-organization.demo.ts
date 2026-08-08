import * as path from "path";
import { DemoTiming, readEnv } from "./helpers";
import { runDemoSession, clickAzureDevOpsIcon } from "./demoRunner";

/**
 * Demo: Add Organization
 *
 * This demo demonstrates:
 * 1. Opening the Azure DevOps extension
 * 2. Adding an organization via the command palette
 * 3. Filling in the URL, organization name, and PAT
 * 4. Viewing the populated tree after connecting
 *
 * Prerequisites:
 * - test/e2e/.env must contain AZURE_DEVOPS_URL, AZURE_DEVOPS_ORGANIZATION, and AZURE_DEVOPS_PAT
 */

const env = readEnv(path.join(process.cwd(), "test", "e2e", ".env"));
const adoUrl = env.AZURE_DEVOPS_URL;
const adoOrganization = env.AZURE_DEVOPS_ORGANIZATION;
const adoPat = env.AZURE_DEVOPS_PAT;

if (!adoUrl || !adoPat) {
  throw new Error("Missing AZURE_DEVOPS_URL or AZURE_DEVOPS_PAT in test/e2e/.env");
}
if (!adoOrganization) {
  throw new Error("Missing AZURE_DEVOPS_ORGANIZATION in test/e2e/.env");
}

runDemoSession("add-organization", async (window, logger, controls) => {
  await clickAzureDevOpsIcon(window, logger);
  await DemoTiming.sleep(DemoTiming.MEDIUM);

  logger.step("Opening command palette");
  await window.keyboard.press("F1");
  await DemoTiming.sleep(DemoTiming.SHORT);

  logger.step("Typing Add Organization command");
  await window.keyboard.type("Add Organization", { delay: 40 });
  await DemoTiming.sleep(DemoTiming.MEDIUM);
  await window.keyboard.press("Enter");
  await DemoTiming.sleep(DemoTiming.MEDIUM);

  logger.step("Entering organization URL");
  await window.fill(".quick-input-box .input", adoUrl);
  await DemoTiming.sleep(DemoTiming.MEDIUM);
  await window.keyboard.press("Enter");
  await DemoTiming.sleep(DemoTiming.SHORT);

  logger.step("Entering organization name");
  await window.keyboard.type(adoOrganization, { delay: 60 });
  await DemoTiming.sleep(DemoTiming.MEDIUM);
  await window.keyboard.press("Enter");
  await DemoTiming.sleep(DemoTiming.SHORT);

  logger.step("Entering Personal Access Token");
  await window.fill(".quick-input-box .input", adoPat);
  await DemoTiming.sleep(DemoTiming.MEDIUM);
  await window.keyboard.press("Enter");

  logger.step("Waiting for organization to appear in tree");
  await DemoTiming.sleep(DemoTiming.EXTRA_LONG);

  logger.step('Opening "Repositories" view');
  await window.click('[aria-label*="Repository"]', { timeout: 15000 });
  await DemoTiming.sleep(DemoTiming.SHORT);
  await window.keyboard.press("ArrowRight");
  await DemoTiming.sleep(DemoTiming.MEDIUM);

  controls.markRecordingStart();

  logger.step('Opening "backend" repository');
  await window.click('[aria-label*="backend"]', { timeout: 15000 });
  await DemoTiming.sleep(DemoTiming.SHORT);
  await window.keyboard.press("ArrowRight");
  await DemoTiming.sleep(DemoTiming.MEDIUM);

  logger.step('Opening "Pull Requests"');
  await window.click('[aria-label*="Pull Requests"]', { timeout: 15000 });
  await DemoTiming.sleep(DemoTiming.SHORT);
  await window.keyboard.press("ArrowRight");
  await DemoTiming.sleep(DemoTiming.MEDIUM);

  logger.step('Opening "Add JWT authentication" pull request');
  await window.click('[aria-label*="Add JWT authentication"]', { timeout: 15000 });
  await DemoTiming.sleep(DemoTiming.LONG);

  logger.step("Demo completed, pausing to show result");
  await DemoTiming.sleep(DemoTiming.LONG);
}).catch((error) => {
  console.error("Demo failed:", error);
  process.exit(1);
});
