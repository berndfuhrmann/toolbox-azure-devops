import type { IWebApiRequestSettings } from "azure-devops-node-api";
import type * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import type * as CoreInterfaces from "azure-devops-node-api/interfaces/CoreInterfaces";
import type * as PipelinesInterfaces from "azure-devops-node-api/interfaces/PipelinesInterfaces";
import type * as VsoBaseInterfaces from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import type { Mock } from "vitest";

// Import the real interfaces to extend them
import type { IAlertApi } from "azure-devops-node-api/AlertApi";
import type { IBuildApi } from "azure-devops-node-api/BuildApi";
import type { ICixApi } from "azure-devops-node-api/CIXApi";
import type { ICoreApi } from "azure-devops-node-api/CoreApi";
import type { IDashboardApi } from "azure-devops-node-api/DashboardApi";
import type { IExtensionManagementApi } from "azure-devops-node-api/ExtensionManagementApi";
import type { IFeatureManagementApi } from "azure-devops-node-api/FeatureManagementApi";
import type { IFileContainerApi } from "azure-devops-node-api/FileContainerApi";
import type { IGalleryApi } from "azure-devops-node-api/GalleryApi";
import type { IGitApi } from "azure-devops-node-api/GitApi";
import type { ILocationsApi } from "azure-devops-node-api/LocationsApi";
import type { IManagementApi } from "azure-devops-node-api/ManagementApi";
import type { INotificationApi } from "azure-devops-node-api/NotificationApi";
import type { IPipelinesApi } from "azure-devops-node-api/PipelinesApi";
import type { IPolicyApi } from "azure-devops-node-api/PolicyApi";
import type { IProfileApi } from "azure-devops-node-api/ProfileApi";
import type { IProjectAnalysisApi } from "azure-devops-node-api/ProjectAnalysisApi";
import type { IReleaseApi } from "azure-devops-node-api/ReleaseApi";
import type { ISecurityRolesApi } from "azure-devops-node-api/SecurityRolesApi";
import type { ITaskAgentApi } from "azure-devops-node-api/TaskAgentApi";
import type { ITaskApi } from "azure-devops-node-api/TaskApi";
import type { ITestApi } from "azure-devops-node-api/TestApi";
import type { ITestPlanApi } from "azure-devops-node-api/TestPlanApi";
import type { ITestResultsApi } from "azure-devops-node-api/TestResultsApi";
import type { IWikiApi } from "azure-devops-node-api/WikiApi";
import type { IWorkApi } from "azure-devops-node-api/WorkApi";
import type { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import type { IWorkItemTrackingProcessApi } from "azure-devops-node-api/WorkItemTrackingProcessApi";
import type { IWorkItemTrackingProcessDefinitionsApi } from "azure-devops-node-api/WorkItemTrackingProcessDefinitionsApi";

// Import PromiseController from its own file
import { PromiseController } from "./PromiseController";

// Mock configuration interface
export interface MockApiConfig {
  shouldReject?: boolean;
  error?: Error;
  controller?: PromiseController<any>;
}

// Mock factory function type
export type MockFactory<T> = (config?: MockApiConfig) => Mock<() => Promise<T>>;

// Create a mock with promise resolution control
export function createMockWithController<T>(defaultValue: T): MockFactory<T> {
  return (config?: MockApiConfig) => {
    const mock = vi.fn();

    if (config?.controller) {
      // Use the provided controller
      mock.mockReturnValue(config.controller.getPromise());
    } else if (config?.shouldReject) {
      // Create a promise that rejects
      const controller = new PromiseController<T>();
      mock.mockReturnValue(controller.getPromise());
      // Reject immediately or with provided error
      setTimeout(() => {
        controller.reject(config.error || new Error("Mock API error"));
      }, 0);
    } else {
      // Create a promise that resolves immediately
      const controller = new PromiseController<T>();
      mock.mockReturnValue(controller.getPromise());
      setTimeout(() => {
        controller.resolve(defaultValue);
      }, 0);
    }

    return mock;
  };
}

export class MockGitApi {
  static getRepositories = vi.fn();
  static getRepository = vi.fn();
  static getBranches = vi.fn();
  static getCommits = vi.fn();
  static getPullRequests = vi.fn();
  static getPullRequestById = vi.fn();
  static getThreads = vi.fn();
  static getComments = vi.fn();
  static getStatuses = vi.fn();

  getRepositories = MockGitApi.getRepositories;
  getRepository = MockGitApi.getRepository;
  getBranches = MockGitApi.getBranches;
  getCommits = MockGitApi.getCommits;
  getPullRequests = MockGitApi.getPullRequests;
  getPullRequestById = MockGitApi.getPullRequestById;
  getThreads = MockGitApi.getThreads;
  getComments = MockGitApi.getComments;
  getStatuses = MockGitApi.getStatuses;
}

export class MockCoreApi {
  static getProjects = vi.fn();

  getProjects = MockCoreApi.getProjects;
}

export class MockPipelinesApi {
  static listRuns = vi.fn();

  listRuns = MockPipelinesApi.listRuns;
}

// Create mock instances for other APIs - these are minimal implementations for testing
export class MockAlertApi {}
export class MockBuildApi {}
export class MockCixApi {}
export class MockDashboardApi {}
export class MockExtensionManagementApi {}
export class MockFeatureManagementApi {}
export class MockFileContainerApi {}
export class MockGalleryApi {}
export class MockLocationsApi {}
export class MockManagementApi {}
export class MockNotificationApi {}
export class MockPolicyApi {}
export class MockProfileApi {}
export class MockProjectAnalysisApi {}
export class MockReleaseApi {}
export class MockSecurityRolesApi {}
export class MockTaskAgentApi {}
export class MockTaskApi {}
export class MockTestApi {}
export class MockTestPlanApi {}
export class MockTestResultsApi {}
export class MockWikiApi {}
export class MockWorkApi {}
export class MockWorkItemTrackingApi {}
export class MockWorkItemTrackingProcessApi {}
export class MockWorkItemTrackingProcessDefinitionsApi {}

export class MockWebApi {
  async getAlertApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockAlertApi();
  }

  async getBuildApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockBuildApi();
  }

  async getCixApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockCixApi();
  }

  async getCoreApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockCoreApi();
  }

  async getDashboardApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockDashboardApi();
  }

  async getExtensionManagementApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockExtensionManagementApi();
  }

  async getFeatureManagementApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockFeatureManagementApi();
  }

  async getFileContainerApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockFileContainerApi();
  }

  async getGalleryApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockGalleryApi();
  }

  async getGitApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockGitApi();
  }

  async getLocationsApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockLocationsApi();
  }

  async getManagementApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockManagementApi();
  }

  async getNotificationApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockNotificationApi();
  }

  async getPipelinesApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockPipelinesApi();
  }

  async getPolicyApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockPolicyApi();
  }

  async getProfileApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockProfileApi();
  }

  async getProjectAnalysisApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockProjectAnalysisApi();
  }

  async getReleaseApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockReleaseApi();
  }

  async getSecurityRolesApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockSecurityRolesApi();
  }

  async getTaskAgentApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockTaskAgentApi();
  }

  async getTaskApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockTaskAgentApi();
  }

  async getTestApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockTestApi();
  }

  async getTestPlanApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockTestPlanApi();
  }

  async getTestResultsApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockTestResultsApi();
  }

  async getWikiApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockWikiApi();
  }

  async getWorkApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockWorkApi();
  }

  async getWorkItemTrackingApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockWorkItemTrackingApi();
  }

  async getWorkItemTrackingProcessApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockWorkItemTrackingProcessApi();
  }

  async getWorkItemTrackingProcessDefinitionsApi(
    defaultUrl: string,
    authHandler: VsoBaseInterfaces.IRequestHandler,
    options?: VsoBaseInterfaces.IRequestOptions,
    requestSettings?: IWebApiRequestSettings,
  ) {
    return new MockWorkItemTrackingProcessDefinitionsApi();
  }
}

// Utility functions for test setup
export function resetAllMocks() {
  vi.clearAllMocks();

  // Reset all mock functions with default return values
  MockGitApi.getRepositories.mockResolvedValue([]);
  MockGitApi.getRepository.mockResolvedValue(null);
  MockGitApi.getBranches.mockResolvedValue([]);
  MockGitApi.getCommits.mockResolvedValue([]);
  MockGitApi.getPullRequests.mockResolvedValue([]);
  MockGitApi.getPullRequestById.mockResolvedValue(null);
  MockGitApi.getThreads.mockResolvedValue([]);
  MockGitApi.getComments.mockResolvedValue([]);
  MockGitApi.getStatuses.mockResolvedValue([]);

  MockCoreApi.getProjects.mockResolvedValue([]);
  MockPipelinesApi.listRuns.mockResolvedValue([]);
}

// Helper function to configure a mock with a specific controller
export function configureMockWithController<T>(mock: Mock<() => Promise<T>>, controller: PromiseController<T>) {
  mock.mockReturnValue(controller.getPromise());
}

// Helper function to configure a mock to reject
export function configureMockRejection<T>(mock: Mock<() => Promise<T>>, error: Error) {
  const controller = new PromiseController<T>();
  mock.mockReturnValue(controller.getPromise());
  setTimeout(() => controller.reject(error), 0);
}
