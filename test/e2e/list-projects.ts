import * as azdev from "azure-devops-node-api";
import { ProjectVisibility, type SourceControlTypes } from "azure-devops-node-api/interfaces/CoreInterfaces";
const servername = process.env.AZURE_DEVOPS_HOST as string;
const pat = process.env.AZURE_DEVOPS_PAT as string;

async function listProjects() {
  // Azure DevOps organization URL
  const orgUrl = `http://${servername}:8080/DefaultCollection`;

  // NTLM authentication with workstation
  const authHandlerNTLM = azdev.getNtlmHandler(
    "vagrant",
    "vagrant",
    "WIN-UEP6JDCABSM",
    //undefined,
    "WIN-UEP6JDCABSM", // workstation parameter
  );

  const authHandlerPAT = azdev.getPersonalAccessTokenHandler(pat);

  // Create connection
  const connection = new azdev.WebApi(orgUrl, authHandlerPAT, {});
  try {
    // Get Core API client
    const coreApi = await connection.getCoreApi();

    // Get all projects
    const projects = await coreApi.queueCreateProject({
      name: "test4",
      description: "test4",
      visibility: 0,
      capabilities: {
        versioncontrol: {
          sourceControlType: "Git",
        },
        processTemplate: {
          templateTypeId: "b8a3a935-7e91-48b8-a94c-606d37c3e9f2",
        },
      },
    });

    console.log(`Found ${JSON.stringify(projects)} projects:\n`);
  } catch (error) {
    console.error("Error fetching projects:", error);
    process.exit(1);
  }
}

listProjects();
