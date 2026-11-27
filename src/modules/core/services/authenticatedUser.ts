import type { ConnectionData } from "azure-devops-node-api/interfaces/LocationsInterfaces";
import { createException, Exception } from "../../../common/Exception";

/**
 * ID of the signed-in user, from the result of LocationsService.connectionData
 */
export function getAuthenticatedUserId(connectionData: ConnectionData | undefined): string | Exception {
  return connectionData?.authenticatedUser?.id ?? createException(new Error("Could not determine the signed-in user"));
}
