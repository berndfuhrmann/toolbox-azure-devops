export interface Account {
  accountId: string;
  url: string;
  organization: string;
  personalAccessToken: string;
}

export function compareAccount(a: Account, b: Account) {
  return a.url === b.url && a.organization === b.organization && a.personalAccessToken === b.personalAccessToken;
}

export function buildAccountUrl(account: Account): string {
  const base = account.url.endsWith("/") ? account.url : account.url + "/";
  const organization = account.organization.startsWith("/") ? account.organization.slice(1) : account.organization;
  return base + organization;
}
