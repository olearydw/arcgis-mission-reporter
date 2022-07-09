import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import PortalUser from "@arcgis/core/portal/PortalUser";
import { MissionServiceBase, MissionServiceInfo } from "../../../typings/mission";
import { FederatedServer } from "../../../typings/portal";
import { getActiveMissionInfo, getAllMissions } from "../../../mediators/MissionMediator";

@subclass("src.components.views.Missions.MissionsViewModel")
class MissionsViewModel extends Accessor {
  constructor(properties?: any) {
    super();
  }

  async initialize() {
    //console.log("initialize vm ::", this);
    // this.loaded = await this._initComponent();
    //
    // console.log("loaded ::", this.loaded);
    //
    // this.ready = true;
    //
    // this.notifyChange("ready");
    //console.log("set ready true ::", this.ready);
  }

  @property()
  activeMissionId = "";

  @property()
  activeMissionInfo: MissionServiceInfo;

  @property()
  loaded = false;

  @property()
  missionServerInfo: FederatedServer | null;

  @property()
  missionServicesList: MissionServiceBase[] = [];

  @property()
  ready = false;

  @property()
  user: PortalUser;

  public initComponent = async (): Promise<boolean> => {
    try {
      // fetch list of all published mission services
      //this.missionServicesList = await getAllMissions();

      const tmp = await getAllMissions();

      console.log("tmp ::", tmp);

      //this._set("missionServicesList", tmp);
      this.missionServicesList = tmp;
      console.log("after set ::", this.missionServicesList);

      this.notifyChange("missionServicesList");

      //this.activeMissionId = getActiveMission
      this.activeMissionInfo = getActiveMissionInfo();

      if (this.activeMissionInfo) {
        this.activeMissionId = this.activeMissionInfo.missionId;
      }

      // component is ready
      return true;
    } catch (e) {
      // no missions available
      return false;
    }
  };
}

export default MissionsViewModel;
