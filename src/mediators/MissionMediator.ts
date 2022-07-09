// model
import AppModel from "../model/AppModel";

// services
import { getMissionService, getMissionServices } from "../services/missionService";

// typings
import { MissionServiceBase, MissionServiceInfo, MissionServiceResponse } from "../typings/mission";

// utilities.portal
import { getFederatedServerUrl } from "../utilities/portal/instance";

/**
 * Method for fetching mission service list
 */
export async function getAllMissions(): Promise<MissionServiceBase[]> {
  const missionServerUrl = getFederatedServerUrl("MissionServer");

  if (!missionServerUrl) {
    return Promise.reject("Mission Server Unavailable");
  }

  try {
    const serviceInfos: MissionServiceResponse = await getMissionServices(missionServerUrl);
    return serviceInfos.services;
  } catch (e) {
    return Promise.reject("error fetching ::");
  }
}

export async function getMissionServiceInfo(missionId: string): Promise<MissionServiceInfo> {
  const appModel = AppModel.getInstance();
  const missionServerUrl = getFederatedServerUrl("MissionServer");

  if (!missionServerUrl) {
    return Promise.reject("Mission Server Unavailable");
  }

  try {
    const serviceInfo = await getMissionService(missionServerUrl,missionId);
    appModel.activeMissionInfo = serviceInfo as MissionServiceInfo;
    return appModel.activeMissionInfo;
  } catch (e) {
    return Promise.reject("failed to get service info");
  }
}

export function getActiveMissionInfo(): MissionServiceInfo {
  const appModel = AppModel.getInstance();
  return appModel.activeMissionInfo;
}
