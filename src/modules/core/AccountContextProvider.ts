import { Container, inject, injectable } from "inversify";
import { filter, map, tap } from "rxjs";
import { AbstractStorageService } from "../../common/storage/AbstractStorageService";
import { ApiService } from "../../generated/ApiService";
import { registerServices } from "../../generated/register";
import { types } from "../../generated/types";
import { Account } from "./account";
import { WorkItemTypeIconService } from "../workItem/services/WorkItemTypeIconService";

@injectable()
export class AccountContextProvider {
  #storageService: AbstractStorageService;
  #containers = new Map<string, Container>();
  #container: Container;

  constructor(
    @inject(types.StorageService) storageService: AbstractStorageService,
    @inject(types.Container) container: Container,
  ) {
    this.#storageService = storageService;
    this.#container = container;
  }

  getAccountContainer(accountId: string) {
    const existingInstance = this.#containers.get(accountId);
    if (existingInstance) {
      return existingInstance;
    }

    const accountObservable = this.#storageService.getAccounts().pipe(
      map((accounts) => accounts.filter((account) => account.accountId === accountId)[0] as Account | undefined),
      tap((account) => {
        if (account === undefined) {
          this.#containers.delete(accountId);
        }
      }),
      filter((account) => !!account),
    );
    const apiService = new ApiService(accountObservable);
    const context = new Container({ parent: this.#container });
    context.bind(types.Account).toConstantValue(accountObservable);
    context.bind(types.ApiService).toConstantValue(apiService);
    context.bind(types.WorkItemTypeIconService).to(WorkItemTypeIconService).inSingletonScope();

    registerServices(context);

    this.#containers.set(accountId, context);
    return context;
  }
}
