import { AuthenticationMethodRegistry } from "../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { PersonalAccessTokenAuthenticationMethod } from "../../../src/modules/core/authentication/PersonalAccessTokenAuthenticationMethod";

export function createTestAuthenticationMethodRegistry() {
  return new AuthenticationMethodRegistry([new PersonalAccessTokenAuthenticationMethod()]);
}
