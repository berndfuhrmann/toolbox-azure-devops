import { inject, injectable } from "inversify";
import { map } from "rxjs";
import { ExtensionContext } from "vscode";
import { autoRefreshInMsDefault, autoRefreshInMsMinimum } from "../config";
import { RawSettingsService } from "../generated/RawSettingsService";
import { types } from "../generated/types";

export interface RefreshSettings {
  autoRefreshInterval: number;
  unwrapAccounts: boolean;
  unwrapProjects: boolean;
}
@injectable()
export class SettingsService extends RawSettingsService {
  constructor(@inject(types.vscodeContext) context: ExtensionContext) {
    super(context);
  }
  override autoRefreshInterval() {
    return super.autoRefreshInterval().pipe(
      map((settingValue) => {
        if (typeof settingValue === "number" && settingValue >= autoRefreshInMsMinimum) {
          return settingValue;
        }
        return autoRefreshInMsDefault;
      }),
    );
  }
}
