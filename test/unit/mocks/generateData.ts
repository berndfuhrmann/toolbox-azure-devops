import { randomUUID } from "crypto";
import { Account } from "../../../src/modules/core/account";

export const createTestAccount = (): Account => ({
  accountId: randomUUID(),
  organization: "some-org",
  personalAccessToken: "some-token",
  url: "http://example.com",
});
