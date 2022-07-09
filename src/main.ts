// css and calcite components
import "./assets/styles/main.scss";
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

// esri.core
import esriConfig from "@arcgis/core/config";

// app config
import appConfig from "./config/app-config.json";

// components
import AppView from "./components/views/App/AppView";

// modules
import { initRouter } from "./router/router";

// utilities
import { getOauthInfos, getUserCredential, registerOauthInfos } from "./utilities/portal/login";
import { initFederatedServers, initPortal } from "./utilities/portal/instance";

// typings
import { AppConfig } from "./typings/app";
import appModel from "./model/AppModel";

// jsapi assets
esriConfig.assetsPath = "./assets/arcgis";

// calcite design assets
defineCustomElements(window);

// Initialize app when page is loaded
window.onload = async () => {
  const config: AppConfig = appConfig;

  // start app container
  const app = new AppView({
    container: "appContainer",
    title: config.appTitle,
  });

  try {
    // get instance of app model
    const model = appModel.getInstance();

    // handle oauth info
    const authInfos = getOauthInfos(config);
    registerOauthInfos(authInfos);

    // get user platform credential
    model.userCredential = await getUserCredential(config);

    // initial portal, set on app model and destructure user object
    const { url, user } = await initPortal(config.portalUrl);
    model.loggedInUser = user;
    esriConfig.portalUrl = url;

    // set portal federated servers on app model
    await initFederatedServers();

    await initRouter(app);
  } catch (e) {
    //window.location.href = "index.html";
    console.log("in error ::", e);
  }
};
