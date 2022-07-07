import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import Portal from "@arcgis/core/portal/Portal";
import { FederatedServer } from "../typings/portal";

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
  federatedServers: FederatedServer[] = [];

  @property()
  portal: Portal;
}

export default AppModel;
