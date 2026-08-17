// generated
import { getPersonalAccessTokenHandler, WebApi } from "azure-devops-node-api";
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
import { injectable } from "inversify";
import {
  catchError,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { isException, Exception, createException } from "../common/Exception";
import { Account, buildAccountUrl } from "../modules/core/account";

@injectable()
export class ApiService {
  #webApi: Observable<WebApi | Exception>;
	#alertApi: Observable<IAlertApi | Exception>;
	#buildApi: Observable<IBuildApi | Exception>;
	#cixApi: Observable<ICixApi | Exception>;
	#coreApi: Observable<ICoreApi | Exception>;
	#dashboardApi: Observable<IDashboardApi | Exception>;
	#extensionManagementApi: Observable<IExtensionManagementApi | Exception>;
	#featureManagementApi: Observable<IFeatureManagementApi | Exception>;
	#fileContainerApi: Observable<IFileContainerApi | Exception>;
	#galleryApi: Observable<IGalleryApi | Exception>;
	#gitApi: Observable<IGitApi | Exception>;
	#locationsApi: Observable<ILocationsApi | Exception>;
	#managementApi: Observable<IManagementApi | Exception>;
	#notificationApi: Observable<INotificationApi | Exception>;
	#pipelinesApi: Observable<IPipelinesApi | Exception>;
	#policyApi: Observable<IPolicyApi | Exception>;
	#profileApi: Observable<IProfileApi | Exception>;
	#projectAnalysisApi: Observable<IProjectAnalysisApi | Exception>;
	#releaseApi: Observable<IReleaseApi | Exception>;
	#securityRolesApi: Observable<ISecurityRolesApi | Exception>;
	#taskAgentApi: Observable<ITaskAgentApi | Exception>;
	#taskApi: Observable<ITaskApi | Exception>;
	#testApi: Observable<ITestApi | Exception>;
	#testPlanApi: Observable<ITestPlanApi | Exception>;
	#testResultsApi: Observable<ITestResultsApi | Exception>;
	#wikiApi: Observable<IWikiApi | Exception>;
	#workApi: Observable<IWorkApi | Exception>;
	#workItemTrackingApi: Observable<IWorkItemTrackingApi | Exception>;
	#workItemTrackingProcessApi: Observable<IWorkItemTrackingProcessApi | Exception>;
	#workItemTrackingProcessDefinitionApi: Observable<IWorkItemTrackingProcessDefinitionsApi | Exception>;

  constructor(
    accountObservable: Observable<Account>
  ) {
    this.#webApi = accountObservable.pipe(
      map((account) => {
        if (isException(account)) {
          return account;
        } else {
          return this.#WebApi(account);
        }
      }),
      shareReplay(1),
    );
    this.#alertApi = this.#makeApi((webApi) => webApi?.getAlertApi());
    this.#buildApi = this.#makeApi((webApi) => webApi?.getBuildApi());
    this.#cixApi = this.#makeApi((webApi) => webApi?.getCixApi());
    this.#coreApi = this.#makeApi((webApi) => webApi?.getCoreApi());
    this.#dashboardApi = this.#makeApi((webApi) => webApi?.getDashboardApi());
    this.#extensionManagementApi = this.#makeApi((webApi) => webApi?.getExtensionManagementApi());
    this.#featureManagementApi = this.#makeApi((webApi) => webApi?.getFeatureManagementApi());
    this.#fileContainerApi = this.#makeApi((webApi) => webApi?.getFileContainerApi());
    this.#galleryApi = this.#makeApi((webApi) => webApi?.getGalleryApi());
    this.#gitApi = this.#makeApi((webApi) => webApi?.getGitApi());
    this.#locationsApi = this.#makeApi((webApi) => webApi?.getLocationsApi());
    this.#managementApi = this.#makeApi((webApi) => webApi?.getManagementApi());
    this.#notificationApi = this.#makeApi((webApi) => webApi?.getNotificationApi());
    this.#pipelinesApi = this.#makeApi((webApi) => webApi?.getPipelinesApi());
    this.#policyApi = this.#makeApi((webApi) => webApi?.getPolicyApi());
    this.#profileApi = this.#makeApi((webApi) => webApi?.getProfileApi());
    this.#projectAnalysisApi = this.#makeApi((webApi) => webApi?.getProjectAnalysisApi());
    this.#releaseApi = this.#makeApi((webApi) => webApi?.getReleaseApi());
    this.#securityRolesApi = this.#makeApi((webApi) => webApi?.getSecurityRolesApi());
    this.#taskAgentApi = this.#makeApi((webApi) => webApi?.getTaskAgentApi());
    this.#taskApi = this.#makeApi((webApi) => webApi?.getTaskApi());
    this.#testApi = this.#makeApi((webApi) => webApi?.getTestApi());
    this.#testPlanApi = this.#makeApi((webApi) => webApi?.getTestPlanApi());
    this.#testResultsApi = this.#makeApi((webApi) => webApi?.getTestResultsApi());
    this.#wikiApi = this.#makeApi((webApi) => webApi?.getWikiApi());
    this.#workApi = this.#makeApi((webApi) => webApi?.getWorkApi());
    this.#workItemTrackingApi = this.#makeApi((webApi) => webApi?.getWorkItemTrackingApi());
    this.#workItemTrackingProcessApi = this.#makeApi((webApi) => webApi?.getWorkItemTrackingProcessApi());
    this.#workItemTrackingProcessDefinitionApi = this.#makeApi((webApi) => webApi?.getWorkItemTrackingProcessDefinitionApi());
  }
	public alertApi() {
    return this.#alertApi;
  }
	public buildApi() {
    return this.#buildApi;
  }
	public cixApi() {
    return this.#cixApi;
  }
	public coreApi() {
    return this.#coreApi;
  }
	public dashboardApi() {
    return this.#dashboardApi;
  }
	public extensionManagementApi() {
    return this.#extensionManagementApi;
  }
	public featureManagementApi() {
    return this.#featureManagementApi;
  }
	public fileContainerApi() {
    return this.#fileContainerApi;
  }
	public galleryApi() {
    return this.#galleryApi;
  }
	public gitApi() {
    return this.#gitApi;
  }
	public locationsApi() {
    return this.#locationsApi;
  }
	public managementApi() {
    return this.#managementApi;
  }
	public notificationApi() {
    return this.#notificationApi;
  }
	public pipelinesApi() {
    return this.#pipelinesApi;
  }
	public policyApi() {
    return this.#policyApi;
  }
	public profileApi() {
    return this.#profileApi;
  }
	public projectAnalysisApi() {
    return this.#projectAnalysisApi;
  }
	public releaseApi() {
    return this.#releaseApi;
  }
	public securityRolesApi() {
    return this.#securityRolesApi;
  }
	public taskAgentApi() {
    return this.#taskAgentApi;
  }
	public taskApi() {
    return this.#taskApi;
  }
	public testApi() {
    return this.#testApi;
  }
	public testPlanApi() {
    return this.#testPlanApi;
  }
	public testResultsApi() {
    return this.#testResultsApi;
  }
	public wikiApi() {
    return this.#wikiApi;
  }
	public workApi() {
    return this.#workApi;
  }
	public workItemTrackingApi() {
    return this.#workItemTrackingApi;
  }
	public workItemTrackingProcessApi() {
    return this.#workItemTrackingProcessApi;
  }
	public workItemTrackingProcessDefinitionApi() {
    return this.#workItemTrackingProcessDefinitionApi;
  }
  #makeApi<T>(getter: (webApi: WebApi) => Promise<T>) {
    return this.#webApi.pipe(
      switchMap((webApi) => {
        if (isException(webApi)) {
          return of(webApi);
        } else {
          return from(getter(webApi)).pipe(
            catchError((error) => {
              return of(createException(error));
            }),
          );
        }
      }),
      shareReplay(1),
    );
  }

  #WebApi(account: Account) {
    return new WebApi(
      buildAccountUrl(account),
      getPersonalAccessTokenHandler(account.personalAccessToken!),
    );
  }
}
