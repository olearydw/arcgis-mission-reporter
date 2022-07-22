// arcgis.core
import esriRequest from "@arcgis/core/request";
import { MissionServiceResponse } from "../typings/mission";

export async function getMissionServices(
  svrUrl: string
): Promise<MissionServiceResponse> {
  const reqUrl = `${svrUrl}/rest/services`;
  const { data } = await esriRequest(reqUrl, {
    query: { f: "json" }
  });

  return data;
}

export async function getMissionService(
  svrUrl: string,
  missionId: string
): Promise<unknown> {
  const reqUrl = `${svrUrl}/rest/services/${missionId}/MissionServer`;
  const { data } = await esriRequest(reqUrl, {
    query: { f: "json" }
  });

  return data;
}

export async function sendMessage(
  svrUrl: string,
  missionId: string,
  token: string,
  json: string
): Promise<boolean> {
  const sendUrl = `${svrUrl}/rest/services/${missionId}/MissionServer/sendMessage`;

  await esriRequest(sendUrl, {
    method: "post",
    query: {
      f: "json",
      message: json,
      token: token
    }
  });
  return Promise.resolve(true);
}
