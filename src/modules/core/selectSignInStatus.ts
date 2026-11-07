import { map, type Observable } from "rxjs";
import type { SignInStatus } from "./authentication/AuthenticationMethod";

/** Selects the sign-in status as the case of a SwitchingTreePartProvider below an account item. */
export function selectSignInStatus(context: Observable<{ signInStatus: SignInStatus }>): Observable<SignInStatus> {
  return context.pipe(map((context) => context.signInStatus));
}
