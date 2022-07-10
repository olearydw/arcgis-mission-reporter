import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import PortalUser from "@arcgis/core/portal/PortalUser";
import { MissionServiceBase, MissionServiceInfo } from "../../../typings/mission";
import { FederatedServer } from "../../../typings/portal";
import { getActiveMissionInfo, getAllMissions } from "../../../mediators/MissionMediator";
import AppModel from "../../../model/AppModel";
import { getDefaultPortalItemThumbnail, makeItemThumbnailUrl } from "../../../utilities/urlUtils";

// import { makeItemThumbnailUrl } from "../../../utilities/urlUtils.ts";

@subclass("src.components.views.Missions.MissionsViewModel")
class MissionsViewModel extends Accessor {
  constructor(properties?: unknown) {
    super();
  }

  async initialize() {
    try {
      await this._initComponent().then(() => {
        this.loaded = true;
      });
    } catch (e) {}
  }

  @property()
  appModel: AppModel = AppModel.getInstance();

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

  public getThumbnailUrl = (id: string, tnPartial: string): string => {
    let tnUrl: string;
    if(!tnPartial) {
      tnUrl = getDefaultPortalItemThumbnail(this.appModel.portal.url);
    } else {
      const contentUrl = tnPartial ? this.appModel.portal.restUrl : this.appModel.portal.url;
      const baseUrl = makeItemThumbnailUrl(contentUrl, id, tnPartial);
      const token = this.appModel.userCredential.token;
      tnUrl = `${baseUrl}?token=${token}`;
    }
    this.appModel.activeMissionThumbnailUrl = tnUrl;
    return tnUrl;
  };

  private _initComponent = async (): Promise<void> => {
    try {
      // fetch list of all published mission services
      this.missionServicesList = await getAllMissions();

      // get active mission info
      this.activeMissionInfo = getActiveMissionInfo();

      // set active mission id
      if (this.activeMissionInfo) {
        this.activeMissionId = this.activeMissionInfo.missionId;
      }

      this.loaded = true;

      this.ready = true;
    } catch (e) {}
  };
}

export default MissionsViewModel;
