import Portal from "@arcgis/core/portal/Portal";
import PortalUser from "@arcgis/core/portal/PortalUser";

import appModel from "../../model/AppModel";
import { getFederatedServers } from "../../services/portalService";
import { FederatedServer, ServerFunction } from "../../typings/portal";

export async function initPortal(url: string): Promise<Portal> {
  const model = appModel.getInstance();
  try {
    const portal: Portal = new Portal({
      url: url
    });
    portal.authMode = "immediate";
    const loadedPortal: Portal = await portal.load();

    // set portal on app model
    model.portal = loadedPortal;

    return model.portal;
  } catch (e) {
    return Promise.reject("Unable to start portal instance");
  }
}

/**
 * Method fetches federated server info from host portal and sets
 * the collection of server infos on the app model
 */
export async function initFederatedServers(): Promise<boolean> {
  const model = appModel.getInstance();
  const rootUrl = getRestUrl();
  const portalId = getPortalId();
  const serversUrl = `${rootUrl}/portals/${portalId}/servers`;

  try {
    model.federatedServers = await getFederatedServers(serversUrl);
    return true;
  } catch (e) {
    return false;
  }
}

export function getFederatedServer(
  serverFunction: ServerFunction
): FederatedServer | null {
  const model = appModel.getInstance();
  const federatedServers: FederatedServer[] = model.federatedServers;

  const foundServer = federatedServers.filter((server) => {
    return server.serverFunction === serverFunction;
  });

  return foundServer?.length ? foundServer[0] : null;
}

export function getFederatedServerUrl(
  serverFunction: ServerFunction
): string | null {
  const server = getFederatedServer(serverFunction);

  return server ? server.url : null;
}

export function getLoggedInUser(): PortalUser | null {
  const p = appModel.getInstance().portal;
  return p?.user ? p.user : null;
}

export function getLoggedInUserName(): string | null {
  const user = appModel.getInstance().portal.user;
  return user ? user.username : null;
}

export function getPortalId(): string | null {
  const p = appModel.getInstance().portal;
  return p ? p.id : null;
}

export function getRestUrl(): string | null {
  const p = appModel.getInstance().portal;
  return p ? p.restUrl : null;
}
