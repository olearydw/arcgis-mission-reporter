import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import Portal from "@arcgis/core/portal/Portal";
import {FederatedServer} from "../typings/portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import {MissionServiceInfo} from "../typings/mission";

@subclass("src.model.AppModel")
class AppModel extends Accessor {
  private static _instance: AppModel;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new AppModel();
    }
    return this._instance;
  }

  //----------------------------------
  // Public Properties
  //----------------------------------

  @property()
  get activeMissionInfo(): MissionServiceInfo {
    return this.activeMissionInfo ?? null;
  };
  set activeMissionInfo(info: MissionServiceInfo) {
    this._set("activeMissionInfo", info);
  }

  @property()
  activeMissionItem: PortalItem;

  @property()
  federatedServers: FederatedServer[] = [];

  @property()
  portal: Portal;
}

export default AppModel;
