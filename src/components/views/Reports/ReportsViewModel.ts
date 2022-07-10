import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import AppModel from "../../../model/AppModel";
import { MissionServiceInfo } from "../../../typings/mission";
import { getPortalItemsByIds } from "../../../services/portalService";
import PortalItem from "@arcgis/core/portal/PortalItem";

@subclass("src.components.views.Reports.ReportsViewModel")
class ReportsViewModel extends Accessor {
  constructor(properties?: unknown) {
    super();
  }

  async initialize() {
    this._initComponent();
  }

  @property()
  appModel: AppModel = AppModel.getInstance();

  @property()
  get activeMissionId(): string {
    const activeMissionInfo = this.appModel.activeMissionInfo;
    return activeMissionInfo ? activeMissionInfo.missionId : "";
  }

  @aliasOf("appModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;
  
  @aliasOf("appModel.activeMissionThumbnailUrl")
  activeMissionThumbnailUrl: string;

  @property()
  ready = false;

  @property()
  reportItems: PortalItem[] = [];

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  private _initComponent = async () => {
    const activeRptIds: string[] = this.activeMissionInfo?.config?.activeReports ?? [];
    this.reportItems = await getPortalItemsByIds(activeRptIds);
    this.ready = true;
  };
}

export default ReportsViewModel;
