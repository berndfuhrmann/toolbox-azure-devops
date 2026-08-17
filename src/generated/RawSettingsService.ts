
import { Disposable, workspace, ExtensionContext } from "vscode";
import { extensionName } from "../config";
import { map, Observable, ReplaySubject } from "rxjs";

export interface RawSettingsServiceData {
  autoRefreshInterval: number | null;
  unwrapAccounts: boolean;
  unwrapProjects: boolean;
}

export class RawSettingsService {
  private static readonly settingsSection = extensionName;
  private static readonly settingAutoRefreshInterval = "autoRefreshInterval";
  private static readonly settingUnwrapAccounts = "unwrapAccounts";
  private static readonly settingUnwrapProjects = "unwrapProjects";

  #configSettingsData: ReplaySubject<RawSettingsServiceData>;
  #autoRefreshInterval: Observable<number | null>;
  #unwrapAccounts: Observable<boolean>;
  #unwrapProjects: Observable<boolean>;

  constructor(context: ExtensionContext) {
    this.#configSettingsData = new ReplaySubject(1);
    this.#configSettingsData.next(this.#getSettingsServiceData());

    context.subscriptions.push(
      workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(RawSettingsService.settingsSection)) {
          this.#configSettingsData.next(this.#getSettingsServiceData());
        }
      }),
      Disposable.from({
        dispose: () => {},
      }),
    );
    
    this.#autoRefreshInterval = this.#configSettingsData.pipe(
      map((data) => data.autoRefreshInterval),
    );
    this.#unwrapAccounts = this.#configSettingsData.pipe(
      map((data) => data.unwrapAccounts),
    );
    this.#unwrapProjects = this.#configSettingsData.pipe(
      map((data) => data.unwrapProjects),
    );
  }

  public autoRefreshInterval(): Observable<number | null> {
    return this.#autoRefreshInterval;
  }

  public unwrapAccounts(): Observable<boolean> {
    return this.#unwrapAccounts;
  }

  public unwrapProjects(): Observable<boolean> {
    return this.#unwrapProjects;
  }

  #getSettingsServiceData() {
    return {
      autoRefreshInterval: this.#getAutoRefreshInterval(),
      unwrapAccounts: this.#getUnwrapAccounts(),
      unwrapProjects: this.#getUnwrapProjects(),
    };
  }

  #getSettings() {
    return workspace.getConfiguration(RawSettingsService.settingsSection);
  }

  #getAutoRefreshInterval(): number | null {
    const value = this.#getSettings().get<number | null>(
      RawSettingsService.settingAutoRefreshInterval
    );
    return value ?? null;
  }

  #getUnwrapAccounts(): boolean {
    const value = this.#getSettings().get<boolean>(
      RawSettingsService.settingUnwrapAccounts
    );
    return value ?? true;
  }

  #getUnwrapProjects(): boolean {
    const value = this.#getSettings().get<boolean>(
      RawSettingsService.settingUnwrapProjects
    );
    return value ?? true;
  }

}