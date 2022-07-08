
// arcgis.core
import esriRequest from "@arcgis/core/request";
import {MissionServiceResponse} from "../typings/mission";

export async function getMissionServices(svrUrl: string): Promise<MissionServiceResponse> {
  const reqUrl = `${svrUrl}/rest/services`;
  const {data} = await esriRequest(reqUrl, {
    query: {f: "json"}
  });

  return data;
}

export async function getMissionService(svrUrl: string, missionId: string): Promise<any> {
  const reqUrl = `${svrUrl}/rest/services/${missionId}/MissionServer`;
  const {data} = await esriRequest(reqUrl, {
    query: {f: "json"}
  });

  return data;
}