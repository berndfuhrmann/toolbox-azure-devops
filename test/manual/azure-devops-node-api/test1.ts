import { getPersonalAccessTokenHandler, WebApi } from "azure-devops-node-api";

const baseUrl = process.env.AZURE_DEVOPS_URL!;
const organization = process.env.AZURE_DEVOPS_ORGANIZATION!;
const personalAccessToken = process.env.AZURE_DEVOPS_PAT!;

async function main() {
  const webApi = new WebApi(`${baseUrl}/${organization}`, getPersonalAccessTokenHandler(personalAccessToken));
  const connectionData = await webApi.connect();

  // API constants
  // const alertApi = await webApi.getAlertApi();
  // const buildApi = await webApi.getBuildApi();
  // const cixApi = await webApi.getCixApi();
  const coreApi = await webApi.getCoreApi();
  // const dashboardApi = await webApi.getDashboardApi();
  // const extensionManagementApi = await webApi.getExtensionManagementApi();
  // const featureManagementApi = await webApi.getFeatureManagementApi();
  // const fileContainerApi = await webApi.getFileContainerApi();
  // const galleryApi = await webApi.getGalleryApi();
  // const gitApi = await webApi.getGitApi();
  // const locationsApi = await webApi.getLocationsApi();
  // const managementApi = await webApi.getManagementApi();
  // const notificationApi = await webApi.getNotificationApi();
  // const pipelinesApi = await webApi.getPipelinesApi();
  // const policyApi = await webApi.getPolicyApi();
  // const profileApi = await webApi.getProfileApi();
  // const projectAnalysisApi = await webApi.getProjectAnalysisApi();
  // const releaseApi = await webApi.getReleaseApi();
  // const securityRolesApi = await webApi.getSecurityRolesApi();
  // const taskAgentApi = await webApi.getTaskAgentApi();
  // const taskApi = await webApi.getTaskApi();
  // const testApi = await webApi.getTestApi();
  // const testPlanApi = await webApi.getTestPlanApi();
  // const testResultsApi = await webApi.getTestResultsApi();
  // const wikiApi = await webApi.getWikiApi();
  const workApi = await webApi.getWorkApi();
  const workItemTrackingApi = await webApi.getWorkItemTrackingApi();
  const workItemTrackingProcessApi = await webApi.getWorkItemTrackingProcessApi();
  // const workItemTrackingProcessDefinitionApi = await webApi.getWorkItemTrackingProcessDefinitionApi();

  const projects = await coreApi.getProjects();
  const project = projects[0];

  const workItemTypes = await workItemTrackingApi.getWorkItemTypes(project.id!);
  console.log(JSON.stringify(workItemTypes, null, 2));
}

main();
