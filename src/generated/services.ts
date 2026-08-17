// generated

import { inject, optional } from "inversify";
import { combineLatest, firstValueFrom, map, of, Observable } from "rxjs";
import { isException, Exception } from "../common/Exception";
import { BatchCoordinator } from "../common/BatchCoordinator";
import { ApiService } from "./ApiService";
import { TupleMap } from "@nfi/tuplemap";
import { DeepMap } from 'deep-equality-data-structures';
import { pagedLoader } from "../common/pagedLoader";
import { OutputChannel } from "vscode";
import {
  createInformationStream,
  InformationStream,
} from "../common/informationStream";
import { types } from "./types";

import { IAlertApi } from "azure-devops-node-api/AlertApi";
import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { ICixApi } from "azure-devops-node-api/CIXApi";
import { ICoreApi } from "azure-devops-node-api/CoreApi";
import { IDashboardApi } from "azure-devops-node-api/DashboardApi";
import { IExtensionManagementApi } from "azure-devops-node-api/ExtensionManagementApi";
import { IFeatureManagementApi } from "azure-devops-node-api/FeatureManagementApi";
import { IFileContainerApi } from "azure-devops-node-api/FileContainerApi";
import { IGalleryApi } from "azure-devops-node-api/GalleryApi";
import { IGitApi } from "azure-devops-node-api/GitApi";
import { ILocationsApi } from "azure-devops-node-api/LocationsApi";
import { IManagementApi } from "azure-devops-node-api/ManagementApi";
import { INotificationApi } from "azure-devops-node-api/NotificationApi";
import { IPipelinesApi } from "azure-devops-node-api/PipelinesApi";
import { IPolicyApi } from "azure-devops-node-api/PolicyApi";
import { IProfileApi } from "azure-devops-node-api/ProfileApi";
import { IProjectAnalysisApi } from "azure-devops-node-api/ProjectAnalysisApi";
import { IReleaseApi } from "azure-devops-node-api/ReleaseApi";
import { ISecurityRolesApi } from "azure-devops-node-api/SecurityRolesApi";
import { ITaskAgentApi } from "azure-devops-node-api/TaskAgentApi";
import { ITaskApi } from "azure-devops-node-api/TaskApi";
import { ITestApi } from "azure-devops-node-api/TestApi";
import { ITestPlanApi } from "azure-devops-node-api/TestPlanApi";
import { ITestResultsApi } from "azure-devops-node-api/TestResultsApi";
import { IWikiApi } from "azure-devops-node-api/WikiApi";
import { IWorkApi } from "azure-devops-node-api/WorkApi";
import { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import { IWorkItemTrackingProcessApi } from "azure-devops-node-api/WorkItemTrackingProcessApi";
import { IWorkItemTrackingProcessDefinitionsApi } from "azure-devops-node-api/WorkItemTrackingProcessDefinitionsApi";
import type * as VSSInterfaces from "azure-devops-node-api/interfaces/common/VSSInterfaces";

import * as AlertInterfaces from "azure-devops-node-api/interfaces/AlertInterfaces";
import * as BuildInterfaces from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as CixInterfaces from "azure-devops-node-api/interfaces/CIXInterfaces";
import * as CoreInterfaces from "azure-devops-node-api/interfaces/CoreInterfaces";
import * as DashboardInterfaces from "azure-devops-node-api/interfaces/DashboardInterfaces";
import * as ExtensionManagementInterfaces from "azure-devops-node-api/interfaces/ExtensionManagementInterfaces";
import * as FeatureManagementInterfaces from "azure-devops-node-api/interfaces/FeatureManagementInterfaces";
import * as FileContainerInterfaces from "azure-devops-node-api/interfaces/FileContainerInterfaces";
import * as GalleryInterfaces from "azure-devops-node-api/interfaces/GalleryInterfaces";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import * as LocationsInterfaces from "azure-devops-node-api/interfaces/LocationsInterfaces";
import * as ManagementInterfaces from "azure-devops-node-api/interfaces/ManagementInterfaces";
import * as NotificationInterfaces from "azure-devops-node-api/interfaces/NotificationInterfaces";
import * as PipelinesInterfaces from "azure-devops-node-api/interfaces/PipelinesInterfaces";
import * as PolicyInterfaces from "azure-devops-node-api/interfaces/PolicyInterfaces";
import * as ProfileInterfaces from "azure-devops-node-api/interfaces/ProfileInterfaces";
import * as ProjectAnalysisInterfaces from "azure-devops-node-api/interfaces/ProjectAnalysisInterfaces";
import * as ReleaseInterfaces from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import * as SecurityRolesInterfaces from "azure-devops-node-api/interfaces/SecurityRolesInterfaces";
import * as TaskAgentInterfaces from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import * as TestInterfaces from "azure-devops-node-api/interfaces/TestInterfaces";
import * as TestPlanInterfaces from "azure-devops-node-api/interfaces/TestPlanInterfaces";
import * as WikiInterfaces from "azure-devops-node-api/interfaces/WikiInterfaces";
import * as WorkInterfaces from "azure-devops-node-api/interfaces/WorkInterfaces";
import * as WorkItemTrackingInterfaces from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import * as WorkItemTrackingProcessDefinitionsInterfaces from "azure-devops-node-api/interfaces/WorkItemTrackingProcessDefinitionsInterfaces";
import * as WorkItemTrackingProcessInterfaces from "azure-devops-node-api/interfaces/WorkItemTrackingProcessInterfaces";

export class AlertService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#alerts: DeepMap<[string, string], WeakRef<InformationStream<AlertInterfaces.Alert[]>>> = new DeepMap();

	#alertsFinalizationRegistry: FinalizationRegistry<[string, string]> = new FinalizationRegistry(key => this.#alerts.delete(key));
	#alertInstances: DeepMap<[string, number, string], WeakRef<InformationStream<AlertInterfaces.AlertAnalysisInstance[]>>> = new DeepMap();

	#alertInstancesFinalizationRegistry: FinalizationRegistry<[string, number, string]> = new FinalizationRegistry(key => this.#alertInstances.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;


  }


  alerts(project: string, repository: string, refreshTrigger: Observable<number>) {
  let entry = this.#alerts.get([project, repository])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (alertApi: IAlertApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started alertApi.alerts ${project} ${repository}`);
     const t0 = performance.now();
     const result = await alertApi.getAlerts(project, repository, undefined, undefined, undefined, undefined, continuationToken);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} alertApi.alerts ${project} ${repository}`);
     return result;
    }), 
    this.#apiService.alertApi()
      );
   const weakRef = new WeakRef(entry);
   this.#alertsFinalizationRegistry.register(weakRef, [project, repository]);
   this.#alerts.set([project, repository], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  alertInstances(project: string, alertId: number, repository: string, refreshTrigger: Observable<number>) {
  let entry = this.#alertInstances.get([project, alertId, repository])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (alertApi: IAlertApi) => {
     this.#outputChannel?.appendLine(`Started alertApi.alertInstances ${project} ${alertId} ${repository}`);
     const t0 = performance.now();
     const result = await alertApi.getAlertInstances(project, alertId, repository);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} alertApi.alertInstances ${project} ${alertId} ${repository}`);
     return result;
    }, 
    this.#apiService.alertApi()
      );
   const weakRef = new WeakRef(entry);
   this.#alertInstancesFinalizationRegistry.register(weakRef, [project, alertId, repository]);
   this.#alertInstances.set([project, alertId, repository], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class BuildService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#artifacts: DeepMap<[string, number], WeakRef<InformationStream<BuildInterfaces.BuildArtifact[]>>> = new DeepMap();

	#artifactsFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#artifacts.delete(key));
	#buildLogs: DeepMap<[string, number], WeakRef<InformationStream<BuildInterfaces.BuildLog[]>>> = new DeepMap();

	#buildLogsFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#buildLogs.delete(key));
	#buildTags: DeepMap<[string, number], WeakRef<InformationStream<string[]>>> = new DeepMap();

	#buildTagsFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#buildTags.delete(key));
	#definition: DeepMap<[string, number], WeakRef<InformationStream<BuildInterfaces.BuildDefinitionReference>>> = new DeepMap();

	#definitionFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#definition.delete(key));
	#definitions: DeepMap<[string, string | undefined], WeakRef<InformationStream<BuildInterfaces.BuildDefinitionReference[]>>> = new DeepMap();

	#definitionsFinalizationRegistry: FinalizationRegistry<[string, string | undefined]> = new FinalizationRegistry(key => this.#definitions.delete(key));
	#folders: DeepMap<string, WeakRef<InformationStream<BuildInterfaces.Folder[]>>> = new DeepMap();

	#foldersFinalizationRegistry: FinalizationRegistry<string> = new FinalizationRegistry(key => this.#folders.delete(key));
	#builds: DeepMap<[string, number[] | undefined], WeakRef<InformationStream<BuildInterfaces.Build[]>>> = new DeepMap();

	#buildsFinalizationRegistry: FinalizationRegistry<[string, number[] | undefined]> = new FinalizationRegistry(key => this.#builds.delete(key));
	#buildTimeline: DeepMap<[string, number], WeakRef<InformationStream<BuildInterfaces.Timeline>>> = new DeepMap();

	#buildTimelineFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#buildTimeline.delete(key));
	#build: DeepMap<[number, string], WeakRef<InformationStream<BuildInterfaces.Build>>> = new DeepMap();

	#buildFinalizationRegistry: FinalizationRegistry<[number, string]> = new FinalizationRegistry(key => this.#build.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;









  }


  artifacts(project: string, buildId: number, refreshTrigger: Observable<number>) {
  let entry = this.#artifacts.get([project, buildId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.artifacts ${project} ${buildId}`);
     const t0 = performance.now();
     const result = await buildApi.getArtifacts(         project,          buildId       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.artifacts ${project} ${buildId}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#artifactsFinalizationRegistry.register(weakRef, [project, buildId]);
   this.#artifacts.set([project, buildId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  buildLogs(project: string, buildId: number, refreshTrigger: Observable<number>) {
  let entry = this.#buildLogs.get([project, buildId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.buildLogs ${project} ${buildId}`);
     const t0 = performance.now();
     const result = await buildApi.getBuildLogs(         project,          buildId       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.buildLogs ${project} ${buildId}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#buildLogsFinalizationRegistry.register(weakRef, [project, buildId]);
   this.#buildLogs.set([project, buildId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  buildTags(project: string, buildId: number, refreshTrigger: Observable<number>) {
  let entry = this.#buildTags.get([project, buildId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.buildTags ${project} ${buildId}`);
     const t0 = performance.now();
     const result = await buildApi.getBuildTags(         project,          buildId       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.buildTags ${project} ${buildId}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#buildTagsFinalizationRegistry.register(weakRef, [project, buildId]);
   this.#buildTags.set([project, buildId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  definition(project: string, definitionId: number, refreshTrigger: Observable<number>) {
  let entry = this.#definition.get([project, definitionId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.definition ${project} ${definitionId}`);
     const t0 = performance.now();
     const result = await buildApi.getDefinition(         project,          definitionId,       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.definition ${project} ${definitionId}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#definitionFinalizationRegistry.register(weakRef, [project, definitionId]);
   this.#definition.set([project, definitionId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  definitions(project: string, path: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#definitions.get([project, path])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started buildApi.definitions ${project} ${path}`);
     const t0 = performance.now();
     const result = await buildApi.getDefinitions(         project,          undefined, /* name */         undefined, /* repositoryId */         undefined, /* repositoryType */         undefined, /* queryOrder */         undefined, /* top */         continuationToken,         undefined, /* minMetricsTime */         undefined, /* definitionIds */         path       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.definitions ${project} ${path}`);
     return result;
    }), 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#definitionsFinalizationRegistry.register(weakRef, [project, path]);
   this.#definitions.set([project, path], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  folders(project: string, refreshTrigger: Observable<number>) {
  let entry = this.#folders.get(project)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started buildApi.folders ${project}`);
     const t0 = performance.now();
     const result = await buildApi.getFolders(project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.folders ${project}`);
     return result;
    }), 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#foldersFinalizationRegistry.register(weakRef, project);
   this.#folders.set(project, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  builds(project: string, definitions: number[] | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#builds.get([project, definitions])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started buildApi.builds ${project} ${definitions}`);
     const t0 = performance.now();
     const result = await buildApi.getBuilds(         project,          definitions,         undefined /*queues*/,         undefined /*buildNumber*/,         undefined /*minTime*/,         undefined /*maxTime*/,         undefined /*requestedFor*/,         undefined /*reasonFilter*/,         undefined /*statusFilter*/,         undefined /*resultFilter*/,         undefined /*tagFilters*/,         undefined /*properties*/,         undefined /*top*/,         continuationToken,         undefined /*maxBuildsPerDefinition*/,         undefined /*deletedFilter*/,         undefined /*queryOrder*/,         undefined /*branchName*/,         undefined /*buildIds*/,         undefined /*repositoryId*/,         undefined /*repositoryType*/,       );
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.builds ${project} ${definitions}`);
     return result;
    }), 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#buildsFinalizationRegistry.register(weakRef, [project, definitions]);
   this.#builds.set([project, definitions], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  buildTimeline(project: string, buildId: number, refreshTrigger: Observable<number>) {
  let entry = this.#buildTimeline.get([project, buildId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.buildTimeline ${project} ${buildId}`);
     const t0 = performance.now();
     const result = await buildApi.getBuildTimeline(project, buildId, undefined, undefined, undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.buildTimeline ${project} ${buildId}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#buildTimelineFinalizationRegistry.register(weakRef, [project, buildId]);
   this.#buildTimeline.set([project, buildId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  build(buildId: number, project: string, refreshTrigger: Observable<number>) {
  let entry = this.#build.get([buildId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (buildApi: IBuildApi) => {
     this.#outputChannel?.appendLine(`Started buildApi.build ${buildId} ${project}`);
     const t0 = performance.now();
     const result = await buildApi.getBuild(project, buildId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} buildApi.build ${buildId} ${project}`);
     return result;
    }, 
    this.#apiService.buildApi()
      );
   const weakRef = new WeakRef(entry);
   this.#buildFinalizationRegistry.register(weakRef, [buildId, project]);
   this.#build.set([buildId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class CixService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class CoreService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#projects: WeakRef<InformationStream<CoreInterfaces.TeamProjectReference[]>> | undefined;

	#projectsFinalizationRegistry: FinalizationRegistry<undefined> = new FinalizationRegistry(key => this.#projects= undefined);
	#teams: DeepMap<[string, boolean | undefined], WeakRef<InformationStream<CoreInterfaces.WebApiTeam[]>>> = new DeepMap();

	#teamsFinalizationRegistry: FinalizationRegistry<[string, boolean | undefined]> = new FinalizationRegistry(key => this.#teams.delete(key));
	#allTeams: DeepMap<boolean | undefined, WeakRef<InformationStream<CoreInterfaces.WebApiTeam[]>>> = new DeepMap();

	#allTeamsFinalizationRegistry: FinalizationRegistry<boolean | undefined> = new FinalizationRegistry(key => this.#allTeams.delete(key));
	#teamMembersWithExtendedProperties: DeepMap<[string, string], WeakRef<InformationStream<VSSInterfaces.TeamMember[]>>> = new DeepMap();

	#teamMembersWithExtendedPropertiesFinalizationRegistry: FinalizationRegistry<[string, string]> = new FinalizationRegistry(key => this.#teamMembersWithExtendedProperties.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;




  }


  projects(refreshTrigger: Observable<number>) {
  let entry = this.#projects ?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (coreApi: ICoreApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started coreApi.projects `);
     const t0 = performance.now();
     const result = await coreApi.getProjects(undefined, undefined, undefined, continuationToken as number | undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} coreApi.projects `);
     return result;
    }), 
    this.#apiService.coreApi()
      );
   const weakRef = new WeakRef(entry);
   this.#projectsFinalizationRegistry.register(weakRef, undefined);
   this.#projects = weakRef;
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  teams(projectId: string, mine: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#teams.get([projectId, mine])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (coreApi: ICoreApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started coreApi.teams ${projectId} ${mine}`);
     const t0 = performance.now();
     const result = await coreApi.getTeams(projectId, mine, continuationToken as number | undefined, undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} coreApi.teams ${projectId} ${mine}`);
     return result;
    }), 
    this.#apiService.coreApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamsFinalizationRegistry.register(weakRef, [projectId, mine]);
   this.#teams.set([projectId, mine], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  allTeams(mine: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#allTeams.get(mine)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (coreApi: ICoreApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started coreApi.allTeams ${mine}`);
     const t0 = performance.now();
     const result = await coreApi.getAllTeams(mine, continuationToken as number | undefined, undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} coreApi.allTeams ${mine}`);
     return result;
    }), 
    this.#apiService.coreApi()
      );
   const weakRef = new WeakRef(entry);
   this.#allTeamsFinalizationRegistry.register(weakRef, mine);
   this.#allTeams.set(mine, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  teamMembersWithExtendedProperties(projectId: string, teamId: string, refreshTrigger: Observable<number>) {
  let entry = this.#teamMembersWithExtendedProperties.get([projectId, teamId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (coreApi: ICoreApi) => pagedLoader(async (continuationToken) => {
     this.#outputChannel?.appendLine(`Started coreApi.teamMembersWithExtendedProperties ${projectId} ${teamId}`);
     const t0 = performance.now();
     const result = await coreApi.getTeamMembersWithExtendedProperties(projectId, teamId, continuationToken as number | undefined, undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} coreApi.teamMembersWithExtendedProperties ${projectId} ${teamId}`);
     return result;
    }), 
    this.#apiService.coreApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamMembersWithExtendedPropertiesFinalizationRegistry.register(weakRef, [projectId, teamId]);
   this.#teamMembersWithExtendedProperties.set([projectId, teamId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class DashboardService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#dashboards: DeepMap<CoreInterfaces.TeamContext, WeakRef<InformationStream<DashboardInterfaces.Dashboard[]>>> = new DeepMap();

	#dashboardsFinalizationRegistry: FinalizationRegistry<CoreInterfaces.TeamContext> = new FinalizationRegistry(key => this.#dashboards.delete(key));
	#dashboard: DeepMap<[CoreInterfaces.TeamContext, string], WeakRef<InformationStream<DashboardInterfaces.Dashboard>>> = new DeepMap();

	#dashboardFinalizationRegistry: FinalizationRegistry<[CoreInterfaces.TeamContext, string]> = new FinalizationRegistry(key => this.#dashboard.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;


  }


  dashboards(teamContext: CoreInterfaces.TeamContext, refreshTrigger: Observable<number>) {
  let entry = this.#dashboards.get(teamContext)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (dashboardApi: IDashboardApi) => {
     this.#outputChannel?.appendLine(`Started dashboardApi.dashboards ${teamContext}`);
     const t0 = performance.now();
     const result = await dashboardApi.getDashboardsByProject(teamContext);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} dashboardApi.dashboards ${teamContext}`);
     return result;
    }, 
    this.#apiService.dashboardApi()
      );
   const weakRef = new WeakRef(entry);
   this.#dashboardsFinalizationRegistry.register(weakRef, teamContext);
   this.#dashboards.set(teamContext, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  dashboard(teamContext: CoreInterfaces.TeamContext, dashboardId: string, refreshTrigger: Observable<number>) {
  let entry = this.#dashboard.get([teamContext, dashboardId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (dashboardApi: IDashboardApi) => {
     this.#outputChannel?.appendLine(`Started dashboardApi.dashboard ${teamContext} ${dashboardId}`);
     const t0 = performance.now();
     const result = await dashboardApi.getDashboard(teamContext, dashboardId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} dashboardApi.dashboard ${teamContext} ${dashboardId}`);
     return result;
    }, 
    this.#apiService.dashboardApi()
      );
   const weakRef = new WeakRef(entry);
   this.#dashboardFinalizationRegistry.register(weakRef, [teamContext, dashboardId]);
   this.#dashboard.set([teamContext, dashboardId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class ExtensionManagementService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class FeatureManagementService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class FileContainerService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#container: DeepMap<[string | undefined, string | undefined], WeakRef<InformationStream<FileContainerInterfaces.FileContainer[]>>> = new DeepMap();

	#containerFinalizationRegistry: FinalizationRegistry<[string | undefined, string | undefined]> = new FinalizationRegistry(key => this.#container.delete(key));
	#items: DeepMap<[number, string | undefined, string | undefined, boolean | undefined, string | undefined, string | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined], WeakRef<InformationStream<FileContainerInterfaces.FileContainerItem[]>>> = new DeepMap();

	#itemsFinalizationRegistry: FinalizationRegistry<[number, string | undefined, string | undefined, boolean | undefined, string | undefined, string | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#items.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;


  }


  container(scope: string | undefined, artifactUris: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#container.get([scope, artifactUris])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (fileContainerApi: IFileContainerApi) => {
     this.#outputChannel?.appendLine(`Started fileContainerApi.container ${scope} ${artifactUris}`);
     const t0 = performance.now();
     const result = await fileContainerApi.getContainers(scope, artifactUris);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} fileContainerApi.container ${scope} ${artifactUris}`);
     return result;
    }, 
    this.#apiService.fileContainerApi()
      );
   const weakRef = new WeakRef(entry);
   this.#containerFinalizationRegistry.register(weakRef, [scope, artifactUris]);
   this.#container.set([scope, artifactUris], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  items(containerId: number, scope: string | undefined, itemPath: string | undefined, metadata: boolean | undefined, format: string | undefined, downloadFileName: string | undefined, includeDownloadTickets: boolean | undefined, isShallow: boolean | undefined, ignoreRequestedMediaType: boolean | undefined, includeBlobMetadata: boolean | undefined, saveAbsolutePath: boolean | undefined, preferRedirect: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#items.get([containerId, scope, itemPath, metadata, format, downloadFileName, includeDownloadTickets, isShallow, ignoreRequestedMediaType, includeBlobMetadata, saveAbsolutePath, preferRedirect])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (fileContainerApi: IFileContainerApi) => {
     this.#outputChannel?.appendLine(`Started fileContainerApi.items ${containerId} ${scope} ${itemPath} ${metadata} ${format} ${downloadFileName} ${includeDownloadTickets} ${isShallow} ${ignoreRequestedMediaType} ${includeBlobMetadata} ${saveAbsolutePath} ${preferRedirect}`);
     const t0 = performance.now();
     const result = await fileContainerApi.getItems(containerId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} fileContainerApi.items ${containerId} ${scope} ${itemPath} ${metadata} ${format} ${downloadFileName} ${includeDownloadTickets} ${isShallow} ${ignoreRequestedMediaType} ${includeBlobMetadata} ${saveAbsolutePath} ${preferRedirect}`);
     return result;
    }, 
    this.#apiService.fileContainerApi()
      );
   const weakRef = new WeakRef(entry);
   this.#itemsFinalizationRegistry.register(weakRef, [containerId, scope, itemPath, metadata, format, downloadFileName, includeDownloadTickets, isShallow, ignoreRequestedMediaType, includeBlobMetadata, saveAbsolutePath, preferRedirect]);
   this.#items.set([containerId, scope, itemPath, metadata, format, downloadFileName, includeDownloadTickets, isShallow, ignoreRequestedMediaType, includeBlobMetadata, saveAbsolutePath, preferRedirect], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class GalleryService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class GitService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#repositories: DeepMap<string | undefined, WeakRef<InformationStream<GitInterfaces.GitRepository[]>>> = new DeepMap();

	#repositoriesFinalizationRegistry: FinalizationRegistry<string | undefined> = new FinalizationRegistry(key => this.#repositories.delete(key));
	#repository: DeepMap<[string, string | undefined], WeakRef<InformationStream<GitInterfaces.GitRepository>>> = new DeepMap();

	#repositoryFinalizationRegistry: FinalizationRegistry<[string, string | undefined]> = new FinalizationRegistry(key => this.#repository.delete(key));
	#branches: DeepMap<string, WeakRef<InformationStream<GitInterfaces.GitBranchStats[]>>> = new DeepMap();

	#branchesFinalizationRegistry: FinalizationRegistry<string> = new FinalizationRegistry(key => this.#branches.delete(key));
	#commits: DeepMap<[string, GitInterfaces.GitQueryCommitsCriteria, string | undefined], WeakRef<InformationStream<GitInterfaces.GitCommitRef[]>>> = new DeepMap();

	#commitsFinalizationRegistry: FinalizationRegistry<[string, GitInterfaces.GitQueryCommitsCriteria, string | undefined]> = new FinalizationRegistry(key => this.#commits.delete(key));
	#commit: DeepMap<[string, string, string | undefined], WeakRef<InformationStream<GitInterfaces.GitCommitRef>>> = new DeepMap();

	#commitFinalizationRegistry: FinalizationRegistry<[string, string, string | undefined]> = new FinalizationRegistry(key => this.#commit.delete(key));
	#pullRequests: DeepMap<[string, number | undefined], WeakRef<InformationStream<GitInterfaces.GitPullRequest[]>>> = new DeepMap();

	#pullRequestsFinalizationRegistry: FinalizationRegistry<[string, number | undefined]> = new FinalizationRegistry(key => this.#pullRequests.delete(key));
	#pullRequestById: DeepMap<[number, string | undefined], WeakRef<InformationStream<GitInterfaces.GitPullRequest>>> = new DeepMap();

	#pullRequestByIdFinalizationRegistry: FinalizationRegistry<[number, string | undefined]> = new FinalizationRegistry(key => this.#pullRequestById.delete(key));
	#threads: DeepMap<[string, number, string | undefined], WeakRef<InformationStream<GitInterfaces.GitPullRequestCommentThread[]>>> = new DeepMap();

	#threadsFinalizationRegistry: FinalizationRegistry<[string, number, string | undefined]> = new FinalizationRegistry(key => this.#threads.delete(key));
	#comments: DeepMap<[string, number, number, string | undefined], WeakRef<InformationStream<GitInterfaces.Comment[]>>> = new DeepMap();

	#commentsFinalizationRegistry: FinalizationRegistry<[string, number, number, string | undefined]> = new FinalizationRegistry(key => this.#comments.delete(key));
	#pullRequestStatuses: DeepMap<[string, string, string | undefined, boolean | undefined], WeakRef<InformationStream<GitInterfaces.GitPullRequestStatus[]>>> = new DeepMap();

	#pullRequestStatusesFinalizationRegistry: FinalizationRegistry<[string, string, string | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#pullRequestStatuses.delete(key));
	#pullRequestWorkItemRefs: DeepMap<[string, number, string | undefined], WeakRef<InformationStream<VSSInterfaces.ResourceRef[]>>> = new DeepMap();

	#pullRequestWorkItemRefsFinalizationRegistry: FinalizationRegistry<[string, number, string | undefined]> = new FinalizationRegistry(key => this.#pullRequestWorkItemRefs.delete(key));
	#items: DeepMap<[string, string | undefined, string | undefined, GitInterfaces.VersionControlRecursionType | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, GitInterfaces.GitVersionDescriptor | undefined, boolean | undefined], WeakRef<InformationStream<GitInterfaces.GitItem[]>>> = new DeepMap();

	#itemsFinalizationRegistry: FinalizationRegistry<[string, string | undefined, string | undefined, GitInterfaces.VersionControlRecursionType | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, GitInterfaces.GitVersionDescriptor | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#items.delete(key));
	#refs: DeepMap<[string, string | undefined, string | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, string | undefined], WeakRef<InformationStream<GitInterfaces.GitRef[]>>> = new DeepMap();

	#refsFinalizationRegistry: FinalizationRegistry<[string, string | undefined, string | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, string | undefined]> = new FinalizationRegistry(key => this.#refs.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;













  }


  repositories(project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#repositories.get(project)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.repositories ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getRepositories(project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.repositories ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#repositoriesFinalizationRegistry.register(weakRef, project);
   this.#repositories.set(project, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  repository(repositoryId: string, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#repository.get([repositoryId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.repository ${repositoryId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getRepository(repositoryId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.repository ${repositoryId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#repositoryFinalizationRegistry.register(weakRef, [repositoryId, project]);
   this.#repository.set([repositoryId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  branches(repositoryId: string, refreshTrigger: Observable<number>) {
  let entry = this.#branches.get(repositoryId)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.branches ${repositoryId}`);
     const t0 = performance.now();
     const result = await gitApi.getBranches(repositoryId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.branches ${repositoryId}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#branchesFinalizationRegistry.register(weakRef, repositoryId);
   this.#branches.set(repositoryId, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  commits(repositoryId: string, searchCriteria: GitInterfaces.GitQueryCommitsCriteria, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#commits.get([repositoryId, searchCriteria, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.commits ${repositoryId} ${searchCriteria} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getCommits(repositoryId, searchCriteria, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.commits ${repositoryId} ${searchCriteria} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#commitsFinalizationRegistry.register(weakRef, [repositoryId, searchCriteria, project]);
   this.#commits.set([repositoryId, searchCriteria, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  commit(commitId: string, repositoryId: string, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#commit.get([commitId, repositoryId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.commit ${commitId} ${repositoryId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getCommit(commitId, repositoryId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.commit ${commitId} ${repositoryId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#commitFinalizationRegistry.register(weakRef, [commitId, repositoryId, project]);
   this.#commit.set([commitId, repositoryId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  pullRequests(repositoryId: string, status: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#pullRequests.get([repositoryId, status])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.pullRequests ${repositoryId} ${status}`);
     const t0 = performance.now();
     const result = await gitApi.getPullRequests(repositoryId, {});
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.pullRequests ${repositoryId} ${status}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#pullRequestsFinalizationRegistry.register(weakRef, [repositoryId, status]);
   this.#pullRequests.set([repositoryId, status], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  pullRequestById(pullRequestId: number, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#pullRequestById.get([pullRequestId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.pullRequestById ${pullRequestId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getPullRequestById(pullRequestId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.pullRequestById ${pullRequestId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#pullRequestByIdFinalizationRegistry.register(weakRef, [pullRequestId, project]);
   this.#pullRequestById.set([pullRequestId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  threads(repositoryId: string, pullRequestId: number, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#threads.get([repositoryId, pullRequestId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.threads ${repositoryId} ${pullRequestId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getThreads(repositoryId, pullRequestId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.threads ${repositoryId} ${pullRequestId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#threadsFinalizationRegistry.register(weakRef, [repositoryId, pullRequestId, project]);
   this.#threads.set([repositoryId, pullRequestId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  comments(repositoryId: string, pullRequestId: number, threadId: number, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#comments.get([repositoryId, pullRequestId, threadId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.comments ${repositoryId} ${pullRequestId} ${threadId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getComments(repositoryId, pullRequestId, threadId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.comments ${repositoryId} ${pullRequestId} ${threadId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#commentsFinalizationRegistry.register(weakRef, [repositoryId, pullRequestId, threadId, project]);
   this.#comments.set([repositoryId, pullRequestId, threadId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  pullRequestStatuses(commitId: string, repositoryId: string, project: string | undefined, latestOnly: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#pullRequestStatuses.get([commitId, repositoryId, project, (latestOnly ?? false)])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.pullRequestStatuses ${commitId} ${repositoryId} ${project} ${latestOnly}`);
     const t0 = performance.now();
     const result = await gitApi.getStatuses(commitId, repositoryId, project, undefined, undefined, latestOnly);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.pullRequestStatuses ${commitId} ${repositoryId} ${project} ${latestOnly}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#pullRequestStatusesFinalizationRegistry.register(weakRef, [commitId, repositoryId, project, (latestOnly ?? false)]);
   this.#pullRequestStatuses.set([commitId, repositoryId, project, (latestOnly ?? false)], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  pullRequestWorkItemRefs(repositoryId: string, pullRequestId: number, project: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#pullRequestWorkItemRefs.get([repositoryId, pullRequestId, project])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.pullRequestWorkItemRefs ${repositoryId} ${pullRequestId} ${project}`);
     const t0 = performance.now();
     const result = await gitApi.getPullRequestWorkItemRefs(repositoryId, pullRequestId, project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.pullRequestWorkItemRefs ${repositoryId} ${pullRequestId} ${project}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#pullRequestWorkItemRefsFinalizationRegistry.register(weakRef, [repositoryId, pullRequestId, project]);
   this.#pullRequestWorkItemRefs.set([repositoryId, pullRequestId, project], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  items(repositoryId: string, project: string | undefined, scopePath: string | undefined, recursionLevel: GitInterfaces.VersionControlRecursionType | undefined, includeContentMetadata: boolean | undefined, latestProcessedChange: boolean | undefined, download: boolean | undefined, includeLinks: boolean | undefined, versionDescriptor: GitInterfaces.GitVersionDescriptor | undefined, zipForUnix: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#items.get([repositoryId, project, scopePath, recursionLevel, includeContentMetadata, latestProcessedChange, download, includeLinks, versionDescriptor, zipForUnix])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.items ${repositoryId} ${project} ${scopePath} ${recursionLevel} ${includeContentMetadata} ${latestProcessedChange} ${download} ${includeLinks} ${versionDescriptor} ${zipForUnix}`);
     const t0 = performance.now();
     const result = await gitApi.getItems(repositoryId, project, scopePath, recursionLevel, includeContentMetadata, latestProcessedChange, download, includeLinks, versionDescriptor, zipForUnix);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.items ${repositoryId} ${project} ${scopePath} ${recursionLevel} ${includeContentMetadata} ${latestProcessedChange} ${download} ${includeLinks} ${versionDescriptor} ${zipForUnix}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#itemsFinalizationRegistry.register(weakRef, [repositoryId, project, scopePath, recursionLevel, includeContentMetadata, latestProcessedChange, download, includeLinks, versionDescriptor, zipForUnix]);
   this.#items.set([repositoryId, project, scopePath, recursionLevel, includeContentMetadata, latestProcessedChange, download, includeLinks, versionDescriptor, zipForUnix], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  refs(repositoryId: string, project: string | undefined, filter: string | undefined, includeLinks: boolean | undefined, includeStatuses: boolean | undefined, includeMyBranches: boolean | undefined, latestStatusesOnly: boolean | undefined, peelTags: boolean | undefined, filterContains: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#refs.get([repositoryId, project, filter, includeLinks, includeStatuses, includeMyBranches, latestStatusesOnly, peelTags, filterContains])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (gitApi: IGitApi) => {
     this.#outputChannel?.appendLine(`Started gitApi.refs ${repositoryId} ${project} ${filter} ${includeLinks} ${includeStatuses} ${includeMyBranches} ${latestStatusesOnly} ${peelTags} ${filterContains}`);
     const t0 = performance.now();
     const result = await gitApi.getRefs(repositoryId, project, filter, includeLinks, includeStatuses, includeMyBranches, latestStatusesOnly, peelTags, filterContains);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} gitApi.refs ${repositoryId} ${project} ${filter} ${includeLinks} ${includeStatuses} ${includeMyBranches} ${latestStatusesOnly} ${peelTags} ${filterContains}`);
     return result;
    }, 
    this.#apiService.gitApi()
      );
   const weakRef = new WeakRef(entry);
   this.#refsFinalizationRegistry.register(weakRef, [repositoryId, project, filter, includeLinks, includeStatuses, includeMyBranches, latestStatusesOnly, peelTags, filterContains]);
   this.#refs.set([repositoryId, project, filter, includeLinks, includeStatuses, includeMyBranches, latestStatusesOnly, peelTags, filterContains], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class LocationsService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class ManagementService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class NotificationService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class PipelinesService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#runs: DeepMap<[string, number], WeakRef<InformationStream<PipelinesInterfaces.Run[]>>> = new DeepMap();

	#runsFinalizationRegistry: FinalizationRegistry<[string, number]> = new FinalizationRegistry(key => this.#runs.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;

  }


  runs(project: string, pipelineId: number, refreshTrigger: Observable<number>) {
  let entry = this.#runs.get([project, pipelineId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (pipelinesApi: IPipelinesApi) => {
     this.#outputChannel?.appendLine(`Started pipelinesApi.runs ${project} ${pipelineId}`);
     const t0 = performance.now();
     const result = await pipelinesApi.listRuns(project, pipelineId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} pipelinesApi.runs ${project} ${pipelineId}`);
     return result;
    }, 
    this.#apiService.pipelinesApi()
      );
   const weakRef = new WeakRef(entry);
   this.#runsFinalizationRegistry.register(weakRef, [project, pipelineId]);
   this.#runs.set([project, pipelineId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class PolicyService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class ProfileService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class ProjectAnalysisService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class ReleaseService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class SecurityRolesService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class TaskAgentService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#agentPools: WeakRef<InformationStream<TaskAgentInterfaces.TaskAgentPool[]>> | undefined;

	#agentPoolsFinalizationRegistry: FinalizationRegistry<undefined> = new FinalizationRegistry(key => this.#agentPools= undefined);
	#agents: DeepMap<[number, boolean | undefined, boolean | undefined], WeakRef<InformationStream<TaskAgentInterfaces.TaskAgent[]>>> = new DeepMap();

	#agentsFinalizationRegistry: FinalizationRegistry<[number, boolean | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#agents.delete(key));
	#agentPoolJobs: DeepMap<[number, number, string | undefined], WeakRef<InformationStream<TaskAgentInterfaces.TaskAgentJobRequest[]>>> = new DeepMap();

	#agentPoolJobsFinalizationRegistry: FinalizationRegistry<[number, number, string | undefined]> = new FinalizationRegistry(key => this.#agentPoolJobs.delete(key));
	#agentJobs: DeepMap<[number, number, number | undefined], WeakRef<InformationStream<TaskAgentInterfaces.TaskAgentJobRequest[]>>> = new DeepMap();

	#agentJobsFinalizationRegistry: FinalizationRegistry<[number, number, number | undefined]> = new FinalizationRegistry(key => this.#agentJobs.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;




  }


  agentPools(refreshTrigger: Observable<number>) {
  let entry = this.#agentPools ?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (taskAgentApi: ITaskAgentApi) => {
     this.#outputChannel?.appendLine(`Started taskAgentApi.agentPools `);
     const t0 = performance.now();
     const result = await taskAgentApi.getAgentPools();
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} taskAgentApi.agentPools `);
     return result;
    }, 
    this.#apiService.taskAgentApi()
      );
   const weakRef = new WeakRef(entry);
   this.#agentPoolsFinalizationRegistry.register(weakRef, undefined);
   this.#agentPools = weakRef;
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  agents(poolId: number, includeCapabilities: boolean | undefined, includeAssignedRequest: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#agents.get([poolId, includeCapabilities, includeAssignedRequest])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (taskAgentApi: ITaskAgentApi) => {
     this.#outputChannel?.appendLine(`Started taskAgentApi.agents ${poolId} ${includeCapabilities} ${includeAssignedRequest}`);
     const t0 = performance.now();
     const result = await taskAgentApi.getAgents(poolId, undefined, includeCapabilities, includeAssignedRequest);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} taskAgentApi.agents ${poolId} ${includeCapabilities} ${includeAssignedRequest}`);
     return result;
    }, 
    this.#apiService.taskAgentApi()
      );
   const weakRef = new WeakRef(entry);
   this.#agentsFinalizationRegistry.register(weakRef, [poolId, includeCapabilities, includeAssignedRequest]);
   this.#agents.set([poolId, includeCapabilities, includeAssignedRequest], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  agentPoolJobs(poolId: number, top: number, continuationToken: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#agentPoolJobs.get([poolId, top, continuationToken])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (taskAgentApi: ITaskAgentApi) => {
     this.#outputChannel?.appendLine(`Started taskAgentApi.agentPoolJobs ${poolId} ${top} ${continuationToken}`);
     const t0 = performance.now();
     const result = await taskAgentApi.getAgentRequests(poolId, top, continuationToken);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} taskAgentApi.agentPoolJobs ${poolId} ${top} ${continuationToken}`);
     return result;
    }, 
    this.#apiService.taskAgentApi()
      );
   const weakRef = new WeakRef(entry);
   this.#agentPoolJobsFinalizationRegistry.register(weakRef, [poolId, top, continuationToken]);
   this.#agentPoolJobs.set([poolId, top, continuationToken], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  agentJobs(poolId: number, agentId: number, completedRequestCount: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#agentJobs.get([poolId, agentId, completedRequestCount])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (taskAgentApi: ITaskAgentApi) => {
     this.#outputChannel?.appendLine(`Started taskAgentApi.agentJobs ${poolId} ${agentId} ${completedRequestCount}`);
     const t0 = performance.now();
     const result = await taskAgentApi.getAgentRequestsForAgent(poolId, agentId, completedRequestCount);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} taskAgentApi.agentJobs ${poolId} ${agentId} ${completedRequestCount}`);
     return result;
    }, 
    this.#apiService.taskAgentApi()
      );
   const weakRef = new WeakRef(entry);
   this.#agentJobsFinalizationRegistry.register(weakRef, [poolId, agentId, completedRequestCount]);
   this.#agentJobs.set([poolId, agentId, completedRequestCount], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class TaskService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class TestService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class TestPlanService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class TestResultsService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class WikiService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class WorkService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#teamSettings: DeepMap<CoreInterfaces.TeamContext, WeakRef<InformationStream<WorkInterfaces.TeamSetting>>> = new DeepMap();

	#teamSettingsFinalizationRegistry: FinalizationRegistry<CoreInterfaces.TeamContext> = new FinalizationRegistry(key => this.#teamSettings.delete(key));
	#teamFieldValues: DeepMap<CoreInterfaces.TeamContext, WeakRef<InformationStream<WorkInterfaces.TeamFieldValues>>> = new DeepMap();

	#teamFieldValuesFinalizationRegistry: FinalizationRegistry<CoreInterfaces.TeamContext> = new FinalizationRegistry(key => this.#teamFieldValues.delete(key));
	#backlogs: DeepMap<CoreInterfaces.TeamContext, WeakRef<InformationStream<WorkInterfaces.BacklogLevelConfiguration[]>>> = new DeepMap();

	#backlogsFinalizationRegistry: FinalizationRegistry<CoreInterfaces.TeamContext> = new FinalizationRegistry(key => this.#backlogs.delete(key));
	#teamIterations: DeepMap<[CoreInterfaces.TeamContext, string | undefined], WeakRef<InformationStream<WorkInterfaces.TeamSettingsIteration[]>>> = new DeepMap();

	#teamIterationsFinalizationRegistry: FinalizationRegistry<[CoreInterfaces.TeamContext, string | undefined]> = new FinalizationRegistry(key => this.#teamIterations.delete(key));
	#teamIteration: DeepMap<[CoreInterfaces.TeamContext, string], WeakRef<InformationStream<WorkInterfaces.TeamSettingsIteration>>> = new DeepMap();

	#teamIterationFinalizationRegistry: FinalizationRegistry<[CoreInterfaces.TeamContext, string]> = new FinalizationRegistry(key => this.#teamIteration.delete(key));
	#capacitiesWithIdentityRefAndTotals: DeepMap<[CoreInterfaces.TeamContext, string], WeakRef<InformationStream<WorkInterfaces.TeamCapacity>>> = new DeepMap();

	#capacitiesWithIdentityRefAndTotalsFinalizationRegistry: FinalizationRegistry<[CoreInterfaces.TeamContext, string]> = new FinalizationRegistry(key => this.#capacitiesWithIdentityRefAndTotals.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;






  }


  teamSettings(teamContext: CoreInterfaces.TeamContext, refreshTrigger: Observable<number>) {
  let entry = this.#teamSettings.get(teamContext)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.teamSettings ${teamContext}`);
     const t0 = performance.now();
     const result = await workApi.getTeamSettings(teamContext);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.teamSettings ${teamContext}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamSettingsFinalizationRegistry.register(weakRef, teamContext);
   this.#teamSettings.set(teamContext, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  teamFieldValues(teamContext: CoreInterfaces.TeamContext, refreshTrigger: Observable<number>) {
  let entry = this.#teamFieldValues.get(teamContext)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.teamFieldValues ${teamContext}`);
     const t0 = performance.now();
     const result = await workApi.getTeamFieldValues(teamContext);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.teamFieldValues ${teamContext}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamFieldValuesFinalizationRegistry.register(weakRef, teamContext);
   this.#teamFieldValues.set(teamContext, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  backlogs(teamContext: CoreInterfaces.TeamContext, refreshTrigger: Observable<number>) {
  let entry = this.#backlogs.get(teamContext)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.backlogs ${teamContext}`);
     const t0 = performance.now();
     const result = await workApi.getBacklogs(teamContext);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.backlogs ${teamContext}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#backlogsFinalizationRegistry.register(weakRef, teamContext);
   this.#backlogs.set(teamContext, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  teamIterations(teamContext: CoreInterfaces.TeamContext, timeframe: string | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#teamIterations.get([teamContext, timeframe])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.teamIterations ${teamContext} ${timeframe}`);
     const t0 = performance.now();
     const result = await workApi.getTeamIterations(teamContext, timeframe);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.teamIterations ${teamContext} ${timeframe}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamIterationsFinalizationRegistry.register(weakRef, [teamContext, timeframe]);
   this.#teamIterations.set([teamContext, timeframe], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  teamIteration(teamContext: CoreInterfaces.TeamContext, id: string, refreshTrigger: Observable<number>) {
  let entry = this.#teamIteration.get([teamContext, id])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.teamIteration ${teamContext} ${id}`);
     const t0 = performance.now();
     const result = await workApi.getTeamIteration(teamContext, id);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.teamIteration ${teamContext} ${id}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#teamIterationFinalizationRegistry.register(weakRef, [teamContext, id]);
   this.#teamIteration.set([teamContext, id], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  capacitiesWithIdentityRefAndTotals(teamContext: CoreInterfaces.TeamContext, iterationId: string, refreshTrigger: Observable<number>) {
  let entry = this.#capacitiesWithIdentityRefAndTotals.get([teamContext, iterationId])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workApi: IWorkApi) => {
     this.#outputChannel?.appendLine(`Started workApi.capacitiesWithIdentityRefAndTotals ${teamContext} ${iterationId}`);
     const t0 = performance.now();
     const result = await workApi.getCapacitiesWithIdentityRefAndTotals(teamContext, iterationId);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workApi.capacitiesWithIdentityRefAndTotals ${teamContext} ${iterationId}`);
     return result;
    }, 
    this.#apiService.workApi()
      );
   const weakRef = new WeakRef(entry);
   this.#capacitiesWithIdentityRefAndTotalsFinalizationRegistry.register(weakRef, [teamContext, iterationId]);
   this.#capacitiesWithIdentityRefAndTotals.set([teamContext, iterationId], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class WorkItemTrackingService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;

	#workItemCoordinator: BatchCoordinator<[number, string | undefined], number, [string | undefined], WorkItemTrackingInterfaces.WorkItem>;

	#queryByWiql: DeepMap<[WorkItemTrackingInterfaces.Wiql, CoreInterfaces.TeamContext | undefined, boolean | undefined, number | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemQueryResult>>> = new DeepMap();

	#queryByWiqlFinalizationRegistry: FinalizationRegistry<[WorkItemTrackingInterfaces.Wiql, CoreInterfaces.TeamContext | undefined, boolean | undefined, number | undefined]> = new FinalizationRegistry(key => this.#queryByWiql.delete(key));
	#queries: DeepMap<[string, WorkItemTrackingInterfaces.QueryExpand | undefined, number | undefined, boolean | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.QueryHierarchyItem[]>>> = new DeepMap();

	#queriesFinalizationRegistry: FinalizationRegistry<[string, WorkItemTrackingInterfaces.QueryExpand | undefined, number | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#queries.delete(key));
	#query: DeepMap<[string, string, WorkItemTrackingInterfaces.QueryExpand | undefined, number | undefined, boolean | undefined, boolean | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.QueryHierarchyItem>>> = new DeepMap();

	#queryFinalizationRegistry: FinalizationRegistry<[string, string, WorkItemTrackingInterfaces.QueryExpand | undefined, number | undefined, boolean | undefined, boolean | undefined]> = new FinalizationRegistry(key => this.#query.delete(key));
	#classificationNode: DeepMap<[string, WorkItemTrackingInterfaces.TreeStructureGroup, string | undefined, number | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemClassificationNode>>> = new DeepMap();

	#classificationNodeFinalizationRegistry: FinalizationRegistry<[string, WorkItemTrackingInterfaces.TreeStructureGroup, string | undefined, number | undefined]> = new FinalizationRegistry(key => this.#classificationNode.delete(key));
	#classificationNodes: DeepMap<[string, number[], number | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemClassificationNode[]>>> = new DeepMap();

	#classificationNodesFinalizationRegistry: FinalizationRegistry<[string, number[], number | undefined]> = new FinalizationRegistry(key => this.#classificationNodes.delete(key));
	#comments: DeepMap<[string, number, number | undefined, string | undefined, boolean | undefined, WorkItemTrackingInterfaces.CommentExpandOptions | undefined, WorkItemTrackingInterfaces.CommentSortOrder | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.CommentList>>> = new DeepMap();

	#commentsFinalizationRegistry: FinalizationRegistry<[string, number, number | undefined, string | undefined, boolean | undefined, WorkItemTrackingInterfaces.CommentExpandOptions | undefined, WorkItemTrackingInterfaces.CommentSortOrder | undefined]> = new FinalizationRegistry(key => this.#comments.delete(key));
	#comment: DeepMap<[string, number, number, boolean | undefined, WorkItemTrackingInterfaces.CommentExpandOptions | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.Comment>>> = new DeepMap();

	#commentFinalizationRegistry: FinalizationRegistry<[string, number, number, boolean | undefined, WorkItemTrackingInterfaces.CommentExpandOptions | undefined]> = new FinalizationRegistry(key => this.#comment.delete(key));
	#workItemIcons: WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemIcon[]>> | undefined;

	#workItemIconsFinalizationRegistry: FinalizationRegistry<undefined> = new FinalizationRegistry(key => this.#workItemIcons= undefined);
	#workItemIconSvg: DeepMap<[string, string | undefined, number | undefined], WeakRef<InformationStream<NodeJS.ReadableStream>>> = new DeepMap();

	#workItemIconSvgFinalizationRegistry: FinalizationRegistry<[string, string | undefined, number | undefined]> = new FinalizationRegistry(key => this.#workItemIconSvg.delete(key));
	#relationTypes: WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemRelationType[]>> | undefined;

	#relationTypesFinalizationRegistry: FinalizationRegistry<undefined> = new FinalizationRegistry(key => this.#relationTypes= undefined);
	#workItemTypeCategories: DeepMap<string, WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemTypeCategory[]>>> = new DeepMap();

	#workItemTypeCategoriesFinalizationRegistry: FinalizationRegistry<string> = new FinalizationRegistry(key => this.#workItemTypeCategories.delete(key));
	#workItemTypeColorAndIcons: DeepMap<string[], WeakRef<InformationStream<{ key: string; value: WorkItemTrackingInterfaces.WorkItemTypeColorAndIcon[]; }[]>>> = new DeepMap();

	#workItemTypeColorAndIconsFinalizationRegistry: FinalizationRegistry<string[]> = new FinalizationRegistry(key => this.#workItemTypeColorAndIcons.delete(key));
	#workItemTypes: DeepMap<string, WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemType[]>>> = new DeepMap();

	#workItemTypesFinalizationRegistry: FinalizationRegistry<string> = new FinalizationRegistry(key => this.#workItemTypes.delete(key));
	#workItemTypeFieldsWithReferences: DeepMap<[string, string, WorkItemTrackingInterfaces.WorkItemTypeFieldsExpandLevel | undefined], WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemTypeFieldWithReferences[]>>> = new DeepMap();

	#workItemTypeFieldsWithReferencesFinalizationRegistry: FinalizationRegistry<[string, string, WorkItemTrackingInterfaces.WorkItemTypeFieldsExpandLevel | undefined]> = new FinalizationRegistry(key => this.#workItemTypeFieldsWithReferences.delete(key));
	#workItemTypeStates: DeepMap<[string, string], WeakRef<InformationStream<WorkItemTrackingInterfaces.WorkItemStateColor[]>>> = new DeepMap();

	#workItemTypeStatesFinalizationRegistry: FinalizationRegistry<[string, string]> = new FinalizationRegistry(key => this.#workItemTypeStates.delete(key));

  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
    this.#workItemCoordinator = new BatchCoordinator(
      this.#apiService.workItemTrackingApi(),
      async (batchIds, [project]) => {
        this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItem ${batchIds} ${project}`);
        const t0 = performance.now();
        const api = await firstValueFrom(this.#apiService.workItemTrackingApi());
        if (isException(api)) throw api;
        const result = await api.getWorkItems(batchIds, undefined, undefined, WorkItemTrackingInterfaces.WorkItemExpand.All, undefined, project) ?? [];
        const t1 = performance.now();
        this.#outputChannel?.appendLine(`Finished ${t1 - t0}ms workItemTrackingApi.workItem ${project}`);
        return result;
      },
      result => result.id!,
      ([id, project]) => ({ item: id, group: [project] }),
    );
















  }


  workItem(id: number, project: string | undefined, refreshTrigger: Observable<number>) {
    return this.#workItemCoordinator.get([id, project], refreshTrigger);
	}

  workItems(ids: number[], project: string | undefined, refreshTrigger: Observable<number>) {
    if (ids.length === 0) return of<WorkItemTrackingInterfaces.WorkItem[]>([]);
    return combineLatest(
      ids.map(id => this.#workItemCoordinator.get([id, project], refreshTrigger)),
    ).pipe(
      map(results => {
        const exception = results.find((r): r is Exception => isException(r));
        return exception ?? (results as WorkItemTrackingInterfaces.WorkItem[]);
      }),
    );
	}

  queryByWiql(query: WorkItemTrackingInterfaces.Wiql, teamContext: CoreInterfaces.TeamContext | undefined, timePrecision: boolean | undefined, top: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#queryByWiql.get([query, teamContext, timePrecision, top])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.queryByWiql ${query} ${teamContext} ${timePrecision} ${top}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.queryByWiql(query, teamContext, timePrecision, top);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.queryByWiql ${query} ${teamContext} ${timePrecision} ${top}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#queryByWiqlFinalizationRegistry.register(weakRef, [query, teamContext, timePrecision, top]);
   this.#queryByWiql.set([query, teamContext, timePrecision, top], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  queries(project: string, expand: WorkItemTrackingInterfaces.QueryExpand | undefined, depth: number | undefined, includeDeleted: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#queries.get([project, expand, depth, includeDeleted])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.queries ${project} ${expand} ${depth} ${includeDeleted}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getQueries(project, expand, depth, includeDeleted);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.queries ${project} ${expand} ${depth} ${includeDeleted}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#queriesFinalizationRegistry.register(weakRef, [project, expand, depth, includeDeleted]);
   this.#queries.set([project, expand, depth, includeDeleted], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  query(project: string, query: string, expand: WorkItemTrackingInterfaces.QueryExpand | undefined, depth: number | undefined, includeDeleted: boolean | undefined, useIsoDateFormat: boolean | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#query.get([project, query, expand, depth, includeDeleted, useIsoDateFormat])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.query ${project} ${query} ${expand} ${depth} ${includeDeleted} ${useIsoDateFormat}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getQuery(project, query, expand, depth, includeDeleted, useIsoDateFormat);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.query ${project} ${query} ${expand} ${depth} ${includeDeleted} ${useIsoDateFormat}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#queryFinalizationRegistry.register(weakRef, [project, query, expand, depth, includeDeleted, useIsoDateFormat]);
   this.#query.set([project, query, expand, depth, includeDeleted, useIsoDateFormat], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  classificationNode(project: string, structureGroup: WorkItemTrackingInterfaces.TreeStructureGroup, path: string | undefined, depth: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#classificationNode.get([project, structureGroup, path, depth])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.classificationNode ${project} ${structureGroup} ${path} ${depth}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getClassificationNode(project, structureGroup, path, depth);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.classificationNode ${project} ${structureGroup} ${path} ${depth}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#classificationNodeFinalizationRegistry.register(weakRef, [project, structureGroup, path, depth]);
   this.#classificationNode.set([project, structureGroup, path, depth], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  classificationNodes(project: string, ids: number[], depth: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#classificationNodes.get([project, ids, depth])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.classificationNodes ${project} ${ids} ${depth}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getClassificationNodes(project, ids, depth, undefined);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.classificationNodes ${project} ${ids} ${depth}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#classificationNodesFinalizationRegistry.register(weakRef, [project, ids, depth]);
   this.#classificationNodes.set([project, ids, depth], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  comments(project: string, workItemId: number, top: number | undefined, continuationToken: string | undefined, includeDeleted: boolean | undefined, expand: WorkItemTrackingInterfaces.CommentExpandOptions | undefined, order: WorkItemTrackingInterfaces.CommentSortOrder | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#comments.get([project, workItemId, top, continuationToken, includeDeleted, expand, order])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.comments ${project} ${workItemId} ${top} ${continuationToken} ${includeDeleted} ${expand} ${order}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getComments(project, workItemId, top, continuationToken, includeDeleted, expand, order);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.comments ${project} ${workItemId} ${top} ${continuationToken} ${includeDeleted} ${expand} ${order}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#commentsFinalizationRegistry.register(weakRef, [project, workItemId, top, continuationToken, includeDeleted, expand, order]);
   this.#comments.set([project, workItemId, top, continuationToken, includeDeleted, expand, order], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  comment(project: string, workItemId: number, commentId: number, includeDeleted: boolean | undefined, expand: WorkItemTrackingInterfaces.CommentExpandOptions | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#comment.get([project, workItemId, commentId, includeDeleted, expand])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.comment ${project} ${workItemId} ${commentId} ${includeDeleted} ${expand}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getComment(project, workItemId, commentId, includeDeleted, expand);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.comment ${project} ${workItemId} ${commentId} ${includeDeleted} ${expand}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#commentFinalizationRegistry.register(weakRef, [project, workItemId, commentId, includeDeleted, expand]);
   this.#comment.set([project, workItemId, commentId, includeDeleted, expand], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemIcons(refreshTrigger: Observable<number>) {
  let entry = this.#workItemIcons ?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemIcons `);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemIcons();
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemIcons `);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemIconsFinalizationRegistry.register(weakRef, undefined);
   this.#workItemIcons = weakRef;
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemIconSvg(icon: string, color: string | undefined, v: number | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#workItemIconSvg.get([icon, color, v])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemIconSvg ${icon} ${color} ${v}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemIconSvg(icon, color, v);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemIconSvg ${icon} ${color} ${v}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemIconSvgFinalizationRegistry.register(weakRef, [icon, color, v]);
   this.#workItemIconSvg.set([icon, color, v], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  relationTypes(refreshTrigger: Observable<number>) {
  let entry = this.#relationTypes ?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.relationTypes `);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getRelationTypes();
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.relationTypes `);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#relationTypesFinalizationRegistry.register(weakRef, undefined);
   this.#relationTypes = weakRef;
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemTypeCategories(project: string, refreshTrigger: Observable<number>) {
  let entry = this.#workItemTypeCategories.get(project)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemTypeCategories ${project}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemTypeCategories(project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemTypeCategories ${project}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemTypeCategoriesFinalizationRegistry.register(weakRef, project);
   this.#workItemTypeCategories.set(project, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemTypeColorAndIcons(projectNames: string[], refreshTrigger: Observable<number>) {
  let entry = this.#workItemTypeColorAndIcons.get(projectNames)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemTypeColorAndIcons ${projectNames}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemTypeColorAndIcons(projectNames);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemTypeColorAndIcons ${projectNames}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemTypeColorAndIconsFinalizationRegistry.register(weakRef, projectNames);
   this.#workItemTypeColorAndIcons.set(projectNames, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemTypes(project: string, refreshTrigger: Observable<number>) {
  let entry = this.#workItemTypes.get(project)?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemTypes ${project}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemTypes(project);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemTypes ${project}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemTypesFinalizationRegistry.register(weakRef, project);
   this.#workItemTypes.set(project, weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemTypeFieldsWithReferences(project: string, type: string, expand: WorkItemTrackingInterfaces.WorkItemTypeFieldsExpandLevel | undefined, refreshTrigger: Observable<number>) {
  let entry = this.#workItemTypeFieldsWithReferences.get([project, type, expand])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemTypeFieldsWithReferences ${project} ${type} ${expand}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemTypeFieldsWithReferences(project, type, expand);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemTypeFieldsWithReferences ${project} ${type} ${expand}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemTypeFieldsWithReferencesFinalizationRegistry.register(weakRef, [project, type, expand]);
   this.#workItemTypeFieldsWithReferences.set([project, type, expand], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}

  workItemTypeStates(project: string, type: string, refreshTrigger: Observable<number>) {
  let entry = this.#workItemTypeStates.get([project, type])?.deref();
  if (!entry) {
      entry = createInformationStream(
    async (workItemTrackingApi: IWorkItemTrackingApi) => {
     this.#outputChannel?.appendLine(`Started workItemTrackingApi.workItemTypeStates ${project} ${type}`);
     const t0 = performance.now();
     const result = await workItemTrackingApi.getWorkItemTypeStates(project, type);
     const t1 = performance.now();
     this.#outputChannel?.appendLine(`Finished  ${t1 - t0} workItemTrackingApi.workItemTypeStates ${project} ${type}`);
     return result;
    }, 
    this.#apiService.workItemTrackingApi()
      );
   const weakRef = new WeakRef(entry);
   this.#workItemTypeStatesFinalizationRegistry.register(weakRef, [project, type]);
   this.#workItemTypeStates.set([project, type], weakRef);
   }
  
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
	}
}

export class WorkItemTrackingProcessService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

export class WorkItemTrackingProcessDefinitionService {
  #apiService: ApiService;
	#outputChannel: OutputChannel;


  constructor(@inject(types.ApiService) apiService: ApiService, @inject(types.outputChannel) @optional() outputChannel: OutputChannel) {
    this.#apiService = apiService;
		this.#outputChannel = outputChannel;
  }

}

