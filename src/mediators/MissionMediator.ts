import {getMissionService, getMissionServices} from "../services/missionService";
import {getFederatedServerUrl} from "../utilities/portal/instance";
import {MissionServiceBase, MissionServiceInfo, MissionServiceResponse} from "../typings/mission";
import AppModel from "../model/AppModel";


export async function getAllMissions(): Promise<MissionServiceBase[]> {
  const missionServerUrl = getFederatedServerUrl("MissionServer");

  if (!missionServerUrl) {
    return Promise.reject("Mission Server Unavailable")
  }

  try {
    const serviceInfos: MissionServiceResponse = await getMissionServices(missionServerUrl);
    const servicesList: MissionServiceBase[] = serviceInfos.services;
    console.log("in mediator ::", servicesList);
    return servicesList;
  } catch (e) {
    console.log("fetch error ::", e);
    return Promise.reject("error fetching ::");
  }
}

export async function getMissionServiceInfo(missionId: string): Promise<MissionServiceInfo> {
  const appModel = AppModel.getInstance();
  const missionServerUrl = getFederatedServerUrl("MissionServer");

  if (!missionServerUrl) {
    return Promise.reject("Mission Server Unavailable")
  }

  try {
    const serviceInfo = await getMissionService(missionServerUrl, missionId);
    console.log("from wire ::", serviceInfo);
    appModel.activeMissionInfo = serviceInfo;
    console.log("from model ::", appModel.activeMissionInfo);
    return appModel.activeMissionInfo;
  } catch (e) {
    return Promise.reject("failed to get service info");
  }
}

export function getActiveMissionInfo(): MissionServiceInfo {
  const appModel = AppModel.getInstance();
  return appModel.activeMissionInfo;
}