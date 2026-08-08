import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SettingsService } from "../../../src/common/SettingsService";
import { createMockContext } from "./mockContext";
import { autoRefreshInMsMinimum } from "../../../src/config";

export class MockSettingsService extends SettingsService {
  #autoRefreshInterval: BehaviorSubject<number>;
  #unwrapAccounts: BehaviorSubject<boolean>;
  #unwrapProjects: BehaviorSubject<boolean>;

  constructor() {
    super(createMockContext());
    this.#autoRefreshInterval = new BehaviorSubject<number>(autoRefreshInMsMinimum);
    this.#unwrapAccounts = new BehaviorSubject<boolean>(true);
    this.#unwrapProjects = new BehaviorSubject<boolean>(true);
  }

  override autoRefreshInterval(): Observable<number> {
    return this.#autoRefreshInterval;
  }

  override unwrapAccounts(): Observable<boolean> {
    return this.#unwrapAccounts;
  }

  override unwrapProjects(): Observable<boolean> {
    return this.#unwrapProjects;
  }

  setAutoRefreshInterval(value: number) {
    this.#autoRefreshInterval.next(value);
  }

  setUnwrapAccounts(value: boolean) {
    this.#unwrapAccounts.next(value);
  }

  setUnwrapProjects(value: boolean) {
    this.#unwrapProjects.next(value);
  }
}
