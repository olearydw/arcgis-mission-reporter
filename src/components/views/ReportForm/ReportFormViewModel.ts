import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import AppModel from "../../../model/AppModel";
import Handles from "@arcgis/core/core/Handles";
import { MissionReportData, MissionServiceInfo } from "../../../typings/mission";
import { setRoute } from "../../../router/router";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { getUuid } from "../../../utilities/appUtils";
import { sendMissionMessage } from "../../../mediators/MissionMediator";

const REPORT_STALE_TIME = 2384424000000;

type ReportFormValue = { field: string; value: string };
type ReportData = {
  layerUrl: string;
  operation: "add";
  feature: {
    attributes: object;
    geometry: {
      spatialReference: { wkid: 4326 };
      x: number;
      y: number;
    };
  };
};
type ReportMessage = {
  uid: string;
  from: string;
  resourceId: string;
  when: number;
  type: "report";
  to: string;
  data: ReportData;
};

@subclass("src.components.views.ReportForm.ReportFormViewModel")
class ReportFormViewModel extends Accessor {
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

  @aliasOf("appModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("appModel.activeMissionReportFormData")
  activeMissionReportFormData: MissionReportData;

  @property()
  missionId: string;

  @property()
  ready = false;

  @property()
  reportItemId: string;

  @property()
  reportType: string;

  @property()
  reportUrl: string;

  @property()
  subtitle: string;

  @property()
  title = "";

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------
  public processFormData = (formData: FormData): Promise<boolean> => {
    // extract values from form
    const formValues: ReportFormValue[] = [];
    for (const [key, value] of formData.entries()) {
      formValues.push({
        field: key,
        value: value as string,
      });
    }

    // make mission report message payload
    const reportFeatureMessage = this._makeReportMessage(formValues);

    try {
      //const reportFeatureJson = reportFeatureMessage;
      const token = this.appModel.userCredential.token;
      // const formData = new FormData();
      //
      // formData.append("message", JSON.stringify(reportFeatureJson));
      // formData.append("token", token);
      // formData.append("f", "json");

      return sendMissionMessage(this.missionId, token, JSON.stringify(reportFeatureMessage));
    } catch (e) {
      return Promise.resolve(false);
    }
  };
  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
  private _makeReportMessage = (formValues: ReportFormValue[]): ReportMessage => {
    const attr = {
      report_type: this.reportType,
      report_item_id: this.reportItemId,
      created_user: this.appModel.portal.user.username,
      mission_id: this.missionId,
      stale_time: REPORT_STALE_TIME,
      created_data: new Date().getTime(),
    };

    formValues.forEach((value) => {
      attr[value.field] = value.value;
    });

    return {
      uid: getUuid(),
      from: this.appModel.portal.user.username,
      resourceId: this.missionId,
      when: new Date().getTime(),
      type: "report",
      to: "*",
      data: {
        layerUrl: this.reportUrl,
        operation: "add",
        feature: {
          attributes: attr,
          geometry: {
            spatialReference: { wkid: 4326 },
            x: 36.416905987253475,
            y: 37.62853540553151,
          },
        },
      },
    };
  };

  private _initComponent = async (): Promise<void> => {
    if (!this.activeMissionReportFormData) {
      setRoute();
      this.ready = true;
      return;
    }

    this.missionId = this.activeMissionInfo.missionId;
    this.reportType = this.activeMissionReportFormData.reportType;
    this.reportItemId = this.activeMissionReportFormData.itemId;
    this.reportUrl = this.activeMissionReportFormData.reportUrl;

    const reportService: FeatureLayer = new FeatureLayer({
      url: this.reportUrl,
    });
    await reportService.load();

    for (const field of reportService.fields) {
      console.log(field.name);
    }

    this.ready = true;
  };
}

export default ReportFormViewModel;
