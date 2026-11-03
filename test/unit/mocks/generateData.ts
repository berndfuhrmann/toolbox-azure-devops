import { randomUUID } from "crypto";
import { Account } from "../../../src/modules/core/account";

export const createTestAccount = (): Account => ({
  accountId: randomUUID(),
  organization: "some-org",
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "some-token" },
  url: "http://example.com",
});
