// Reads test/e2e/.env and seeds the demo Azure DevOps Server with projects, repositories,
// branches, commits, tags, and pull requests as defined in demo-data.ts.
//
// Usage (from repo root):
//   npx ts-node test/e2e/seed-demo.ts

import * as azdev from "azure-devops-node-api";
import { IGitApi } from "azure-devops-node-api/GitApi";
import * as fs from "node:fs";
import * as path from "node:path";
import { DemoCommit, DemoProject, DemoRepository, demoProjects } from "./demo-data";

const NilObjectId = "0000000000000000000000000000000000000000";

function readEnv(filePath: string): Record<string, string> {
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf-8")
      .split(/\r?\n/)
      .filter((line) => line.includes("="))
      .map((line) => {
        const eq = line.indexOf("=");
        return [line.slice(0, eq).trim(), line.slice(eq + 1).trim()];
      }),
  );
}

async function getBranchTip(
  gitApi: IGitApi,
  repositoryId: string,
  projectId: string,
  branchName: string,
): Promise<string | undefined> {
  const refs = await gitApi.getRefs(repositoryId, projectId, `heads/${branchName}`);
  return refs[0]?.objectId;
}

async function pushCommit(
  gitApi: IGitApi,
  repositoryId: string,
  projectId: string,
  refName: string,
  oldObjectId: string,
  commit: DemoCommit,
): Promise<void> {
  await gitApi.createPush(
    {
      refUpdates: [{ name: refName, oldObjectId }],
      commits: [
        {
          comment: commit.message,
          changes: commit.files.map((file) => ({
            changeType: 1, // VersionControlChangeType.Add
            item: { path: file.path },
            newContent: {
              content: file.content,
              contentType: 0, // ItemContentType.RawText
            },
          })),
        },
      ],
    },
    repositoryId,
    projectId,
  );
}

async function seedRepository(gitApi: IGitApi, projectId: string, demoRepo: DemoRepository): Promise<void> {
  console.log(`  Repository '${demoRepo.name}'...`);

  const existingRepos = await gitApi.getRepositories(projectId);
  let repo = existingRepos.find((r) => r.name === demoRepo.name);

  if (!repo) {
    console.log(`    Creating repository '${demoRepo.name}'...`);
    repo = await gitApi.createRepository({ name: demoRepo.name }, projectId);
  }

  if (!repo.id) {
    throw new Error(`Repository '${demoRepo.name}' has no ID after creation.`);
  }

  const repositoryId = repo.id;
  const defaultBranchRef = `refs/heads/${demoRepo.defaultBranch}`;

  const refsAfterInit = await gitApi.getRefs(repositoryId, projectId);
  if (!refsAfterInit.some((r) => r.name === defaultBranchRef)) {
    console.log(`    Pushing initial commit to '${demoRepo.defaultBranch}'...`);
    await pushCommit(gitApi, repositoryId, projectId, defaultBranchRef, NilObjectId, demoRepo.initialCommit);
  }

  for (const branch of demoRepo.branches) {
    const branchRef = `refs/heads/${branch.name}`;
    const currentRefs = await gitApi.getRefs(repositoryId, projectId);

    if (currentRefs.some((r) => r.name === branchRef)) {
      console.log(`    Branch '${branch.name}' already exists — skipping.`);
      continue;
    }

    const sourceBranchName = branch.sourceBranch ?? demoRepo.defaultBranch;
    const sourceTip = await getBranchTip(gitApi, repositoryId, projectId, sourceBranchName);

    if (!sourceTip) {
      console.warn(`    Source branch '${sourceBranchName}' not found for '${branch.name}' — skipping.`);
      continue;
    }

    await gitApi.updateRefs(
      [{ name: branchRef, oldObjectId: NilObjectId, newObjectId: sourceTip }],
      repositoryId,
      projectId,
    );
    console.log(`    Created branch '${branch.name}' from '${sourceBranchName}'.`);

    for (const commit of branch.commits) {
      const currentTip = await getBranchTip(gitApi, repositoryId, projectId, branch.name);
      if (!currentTip) {
        console.warn(`    Could not get tip of '${branch.name}' — stopping commits.`);
        break;
      }
      await pushCommit(gitApi, repositoryId, projectId, branchRef, currentTip, commit);
      console.log(`    Pushed '${commit.message}' to '${branch.name}'.`);
    }
  }

  const existingTagRefs = new Set((await gitApi.getRefs(repositoryId, projectId, "tags/")).map((r) => r.name));

  for (const tag of demoRepo.tags) {
    const tagRef = `refs/tags/${tag.name}`;

    if (existingTagRefs.has(tagRef)) {
      console.log(`    Tag '${tag.name}' already exists — skipping.`);
      continue;
    }

    const branchTip = await getBranchTip(gitApi, repositoryId, projectId, tag.onBranch);
    if (!branchTip) {
      console.warn(`    Branch '${tag.onBranch}' not found for tag '${tag.name}' — skipping.`);
      continue;
    }

    await gitApi.createAnnotatedTag(
      { name: tag.name, message: tag.message, taggedObject: { objectId: branchTip } },
      projectId,
      repositoryId,
    );
    console.log(`    Created tag '${tag.name}'.`);
  }

  const existingPullRequests = await gitApi.getPullRequests(repositoryId, {}, projectId);
  const existingPullRequestTitles = new Set(existingPullRequests.map((p) => p.title));

  for (const pullRequest of demoRepo.pullRequests) {
    if (existingPullRequestTitles.has(pullRequest.title)) {
      console.log(`    PR '${pullRequest.title}' already exists — skipping.`);
      continue;
    }

    await gitApi.createPullRequest(
      {
        title: pullRequest.title,
        description: pullRequest.description,
        sourceRefName: `refs/heads/${pullRequest.sourceBranch}`,
        targetRefName: `refs/heads/${pullRequest.targetBranch}`,
      },
      repositoryId,
      projectId,
    );
    console.log(`    Created PR '${pullRequest.title}'.`);
  }
}

async function seedProject(connection: azdev.WebApi, demoProject: DemoProject): Promise<void> {
  console.log(`\nSeeding project '${demoProject.name}'...`);
  const coreApi = await connection.getCoreApi();

  const processes = await coreApi.getProcesses();
  const template = processes.find((p) => p.name === demoProject.processTemplate) ?? processes[0];
  if (!template?.id) {
    throw new Error(`No process templates found. Got: ${JSON.stringify(processes)}`);
  }
  console.log(`  Process template: ${template.name} (${template.id})`);

  let existingProjects = await coreApi.getProjects();
  let project = existingProjects.find((p) => p.name === demoProject.name);

  if (!project) {
    console.log(`  Creating project '${demoProject.name}'...`);
    await coreApi.queueCreateProject({
      name: demoProject.name,
      description: demoProject.description,
      visibility: 0,
      capabilities: {
        versioncontrol: { sourceControlType: "Git" },
        processTemplate: { templateTypeId: template.id },
      },
    });

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      existingProjects = await coreApi.getProjects();
      project = existingProjects.find((p) => p.name === demoProject.name);
      if (project) {
        console.log(`  Project '${demoProject.name}' created.`);
        break;
      }
    }

    if (!project) {
      throw new Error(`Project '${demoProject.name}' did not appear after 90 seconds.`);
    }
  } else {
    console.log(`  Project '${demoProject.name}' already exists.`);
  }

  if (!project.id) {
    throw new Error(`Project '${demoProject.name}' has no ID.`);
  }

  const gitApi = await connection.getGitApi();
  for (const demoRepo of demoProject.repositories) {
    await seedRepository(gitApi, project.id, demoRepo);
  }
}

async function main() {
  const env = readEnv(path.join(__dirname, ".env"));
  const serverUrl = env.AZURE_DEVOPS_URL;
  const pat = env.AZURE_DEVOPS_PAT;

  if (!serverUrl || !pat) {
    console.error("Missing AZURE_DEVOPS_URL or AZURE_DEVOPS_PAT in test/e2e/.env");
    process.exit(1);
  }

  const orgUrl = `${serverUrl}/DefaultCollection`;
  console.log(`Connecting to ${orgUrl} ...`);

  const connection = new azdev.WebApi(orgUrl, azdev.getPersonalAccessTokenHandler(pat));

  for (const demoProject of demoProjects) {
    await seedProject(connection, demoProject);
  }

  console.log("\nSeeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
