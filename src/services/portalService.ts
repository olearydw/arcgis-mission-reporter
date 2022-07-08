
// arcgis.core
import esriRequest from "@arcgis/core/request";

// typings
import { FederatedServer } from "../typings/portal";

export async function getFederatedServers(serversUrl: string): Promise<FederatedServer[]> {
  const response = await esriRequest(serversUrl, {
    query: { f: "json" },
  });

  return response.data?.servers ?? [];
}
