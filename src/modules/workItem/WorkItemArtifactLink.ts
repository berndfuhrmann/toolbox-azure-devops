import { WorkItemRelation } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Account, buildAccountUrl } from "../core/account";

const commitPrefix = "vstfs:///Git/Commit/";
const pullRequestPrefix = "vstfs:///Git/PullRequestId/";
const branchPrefix = "vstfs:///Git/Ref/";
const buildPrefix = "vstfs:///Build/Build/";

export function isCommitRelation(relation: WorkItemRelation): boolean {
  return relation.url?.startsWith(commitPrefix) ?? false;
}

export function isPullRequestRelation(relation: WorkItemRelation): boolean {
  return relation.url?.startsWith(pullRequestPrefix) ?? false;
}

export function isBranchRelation(relation: WorkItemRelation): boolean {
  return relation.url?.startsWith(branchPrefix) ?? false;
}

export function isBuildRelation(relation: WorkItemRelation): boolean {
  return relation.url?.startsWith(buildPrefix) ?? false;
}

export function isCategorizedArtifactLink(relation: WorkItemRelation): boolean {
  return (
    isCommitRelation(relation) ||
    isPullRequestRelation(relation) ||
    isBranchRelation(relation) ||
    isBuildRelation(relation)
  );
}

export function parseCommitUrl(url: string): { projectId: string; repositoryId: string; commitId: string } | undefined {
  const parsed = parseVstfsGitUrl(url, commitPrefix);
  if (!parsed) {
    return undefined;
  }
  return { projectId: parsed.projectId, repositoryId: parsed.repositoryId, commitId: parsed.resourceId };
}

export function parsePullRequestUrl(url: string): number | undefined {
  const parsed = parseVstfsGitUrl(url, pullRequestPrefix);
  if (!parsed) {
    return undefined;
  }
  const prId = parseInt(parsed.resourceId, 10);
  if (isNaN(prId)) {
    return undefined;
  }
  return prId;
}

export function parseBuildUrl(url: string): number | undefined {
  if (!url.startsWith(buildPrefix)) {
    return undefined;
  }
  const buildId = url.slice(buildPrefix.length);
  if (!buildId) {
    return undefined;
  }
  return parseInt(buildId, 10);
}

function parseVstfsGitUrl(
  url: string,
  prefix: string,
): { projectId: string; repositoryId: string; resourceId: string } | undefined {
  if (!url.startsWith(prefix)) {
    return undefined;
  }
  const decoded = decodeURIComponent(url.slice(prefix.length));
  const parts = decoded.split("/");
  if (parts.length < 3) {
    return undefined;
  }
  return { projectId: parts[0], repositoryId: parts[1], resourceId: parts[2] };
}

export function getPullRequestWebUrl(account: Account, relation: WorkItemRelation): string | undefined {
  if (!isPullRequestRelation(relation) || !relation.url) {
    return undefined;
  }
  const parsed = parseVstfsGitUrl(relation.url, pullRequestPrefix);
  if (!parsed) {
    return undefined;
  }
  const base = buildAccountUrl(account);
  return `${base}/${parsed.projectId}/_git/${parsed.repositoryId}/pullrequest/${parsed.resourceId}`;
}

export function getCommitWebUrl(account: Account, relation: WorkItemRelation): string | undefined {
  if (!isCommitRelation(relation) || !relation.url) {
    return undefined;
  }
  const parsed = parseVstfsGitUrl(relation.url, commitPrefix);
  if (!parsed) {
    return undefined;
  }
  const base = buildAccountUrl(account);
  return `${base}/${parsed.projectId}/_git/${parsed.repositoryId}/commit/${parsed.resourceId}`;
}

export function parseBranchUrl(url: string): string | undefined {
  if (!url.startsWith(branchPrefix)) {
    return undefined;
  }
  const remainder = decodeURIComponent(url.slice(branchPrefix.length));
  const parts = remainder.split("/");
  if (parts.length < 4) {
    return undefined;
  }
  const branchPath = parts.slice(2).join("/");
  return branchPath.replace(/^refs\/heads\//, "");
}

export function getBranchWebUrl(account: Account, relation: WorkItemRelation): string | undefined {
  if (!isBranchRelation(relation) || !relation.url) {
    return undefined;
  }
  const branchName = parseBranchUrl(relation.url);
  if (!branchName) {
    return undefined;
  }
  const remainder = relation.url.slice(branchPrefix.length);
  const parts = remainder.split("/");
  const projectId = parts[0];
  const repositoryId = parts[1];
  const base = buildAccountUrl(account);
  return `${base}/${projectId}/_git/${repositoryId}?version=GB${encodeURIComponent(branchName)}`;
}

export function getBuildWebUrl(account: Account, projectId: string, relation: WorkItemRelation): string | undefined {
  if (!isBuildRelation(relation) || !relation.url) {
    return undefined;
  }
  const buildId = relation.url.slice(buildPrefix.length);
  if (!buildId) {
    return undefined;
  }
  const base = buildAccountUrl(account);
  return `${base}/${projectId}/_build/results?buildId=${buildId}`;
}
