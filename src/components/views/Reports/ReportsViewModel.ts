import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import AppModel from "../../../model/AppModel";
import { MissionServiceInfo } from "../../../typings/mission";
import { getPortalItemData, getPortalItemsByIds } from "../../../services/portalService";
import PortalItem from "@arcgis/core/portal/PortalItem";
import Handles from "@arcgis/core/core/Handles";

@subclass("src.components.views.Reports.ReportsViewModel")
class ReportsViewModel extends Accessor {
  constructor(properties?: unknown) {
    super();
  }

  async initialize() {
    await this._initComponent();
  }

  destroy() {
    if (this._handles) {
      this._handles.destroy();
      this._handles = null;
    }
  }

  private _handles: Handles = new Handles();

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

  @aliasOf("appModel.activeMissionReportId")
  activeMissionReportId: string;

  @property()
  ready = false;

  @property()
  showLoader = false;

  @property()
  reportItems: PortalItem[] = [];

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------
  public getReportDetails = async (rptId: string): Promise<boolean> => {
    const restUrl = this.appModel.portal.restUrl;
    try {
      this.appModel.activeMissionReportFormData = await getPortalItemData(restUrl, rptId);
      return true;
    } catch (e) {
      return false;
    }
  };

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  private _initComponent = async () => {
    const activeRptIds: string[] = this.activeMissionInfo?.config?.activeReports ?? [];
    this.reportItems = await getPortalItemsByIds(activeRptIds);
    // TODO -- add lookup of report data for selected report
    this.ready = true;
  };
}

export default ReportsViewModel;
