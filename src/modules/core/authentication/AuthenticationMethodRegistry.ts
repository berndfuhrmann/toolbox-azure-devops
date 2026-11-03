import { injectable, multiInject } from "inversify";
import { types } from "../../../generated/types";
import { AuthenticationType } from "../account";
import { AuthenticationMethod } from "./AuthenticationMethod";

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
}
