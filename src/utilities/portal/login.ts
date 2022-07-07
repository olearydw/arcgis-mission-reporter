// arcgis.core
import Credential from "@arcgis/core/identity/Credential";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";

// types
import { AppConfig } from "../../typings/app";

/**
 * Method for obtaining logged in user credential object
 */
export async function getUserCredential(appConfig: AppConfig): Promise<Credential> {
  const { portalUrl } = appConfig;
  const url = `${portalUrl}/sharing`;
  try {
    return await esriId.checkSignInStatus(url);
  } catch (e) {
    return await esriId.getCredential(url, { oAuthPopupConfirmation: false });
  }
}

export function getOauthInfos(appConfig: AppConfig): OAuthInfo {
  const { appId, portalUrl } = appConfig;
  return new OAuthInfo({
    appId: appId,
    portalUrl: portalUrl,
    flowType: "authorization-code",
    popup: true,
    popupCallbackUrl: "oauth-callback.html",
  });
}

export function registerOauthInfos(oAuthInfo: OAuthInfo) {
  esriId.registerOAuthInfos([oAuthInfo]);
}
