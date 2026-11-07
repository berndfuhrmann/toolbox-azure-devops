import { injectable, multiInject } from "inversify";
import { types } from "../../../generated/types";
import { Observable, of } from "rxjs";
import { Account, AuthenticationType } from "../account";
import { AuthenticationMethod, SignInStatus } from "./AuthenticationMethod";

@injectable()
export class AuthenticationMethodRegistry {
  #methods: AuthenticationMethod[];

  constructor(@multiInject(types.AuthenticationMethod) methods: AuthenticationMethod[]) {
    this.#methods = methods;
  }

  get(type: AuthenticationType): AuthenticationMethod {
    const method = this.#methods.find((method) => method.type === type);
    if (!method) {
      throw new Error(`Unknown authentication method: ${type}`);
    }
    return method;
  }

  all(): readonly AuthenticationMethod[] {
    return this.#methods;
  }

  /** The sign-in status of the account. An unknown method counts as signed in, its requests fail with a visible error. */
  signInStatus(account: Account): Observable<SignInStatus> {
    const method = this.#methods.find((method) => method.type === account.authentication.type);
    return method ? method.signInStatus(account) : of("signedIn");
  }
}
