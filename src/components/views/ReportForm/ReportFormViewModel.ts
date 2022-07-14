import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import AppModel from "../../../model/AppModel";
import Handles from "@arcgis/core/core/Handles";
import { MissionReportData, MissionReportQuestion, MissionServiceInfo } from "../../../typings/mission";
import { setRoute } from "../../../router/router";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { getUuid } from "../../../utilities/appUtils";
import { sendMissionMessage } from "../../../mediators/MissionMediator";
import Point from "@arcgis/core/geometry/Point";
import { AppConfig, RenderState } from "../../../typings/app";
//import { watch } from "@arcgis/core/core/reactiveUtils";
import PortalItem from "@arcgis/core/portal/PortalItem";
//import Query from "@arcgis/core/rest/support/Query";

// app config
import appConfig from "../../../config/app-config.json";

const REPORT_STALE_TIME = 2384424000000;
const SUPPORTED_FIELD_TYPES = ["esriQuestionTypeText", "esriQuestionTypeTextArea"];

type IncidentFeature = {
  incidentname: string;
  incidentdescription: string;
  incidentid: string;
  incidentlatitude: number;
  incidentlongitude: number;
  incidentnotes: string;
  incidentseverity: number;
  incidentsource: string;
  incidenttype: string;
};

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

    // if (this.incidentId) {
    //
    // }

    // this._handles.add(
    //   watch(
    //     () => this.incidentId,
    //     (value) => {
    //       this._fetchIncidentDetails(this.incidentId);
    //     },
    //   ),
    // );
  }

  destroy() {
    if (this._handles) {
      this._handles.destroy();
      this._handles = null;
    }
  }

  private _handles: Handles = new Handles();
  private _appConfig: AppConfig = appConfig;

  @property()
  appModel: AppModel = AppModel.getInstance();

  @aliasOf("appModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("appModel.activeMissionReportFormData")
  activeMissionReportFormData: MissionReportData;

  @property()
  incidentId = "1=1";

  @property()
  mapId: string;

  @property()
  missionId: string;

  @property()
  ready = false;

  @property()
  renderState: RenderState = "loading";

  @property()
  reportItemId: string;

  @property()
  reportLoc: Point;

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
  public processFormData = async (formData: FormData): Promise<boolean> => {
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
      //const token = this.appModel.userCredential.token;
      //return sendMissionMessage(this.missionId, token, JSON.stringify(reportFeatureMessage));
      await this.postMissionMessage(reportFeatureMessage);
      this.renderState = "success";
    } catch (e) {
      return Promise.resolve(false);
    }
  };

  public postMissionMessage(reportMessage: ReportMessage): Promise<any> {
    const token = this.appModel.userCredential.token;
    try {
      return sendMissionMessage(this.missionId, token, JSON.stringify(reportMessage));
    } catch (err) {
      console.log("err in post ::", err);
    }
  }

  public fetchIncidentDetails = async (incidentId: string) => {
    const layerItem: PortalItem = new PortalItem({
      id: this._appConfig.incidentLyrId,
    });

    await layerItem.load();

    const incidentLayer: FeatureLayer = new FeatureLayer({
      url: layerItem.url,
      outFields: ["*"],
      //definitionExpression: `incidentid = ${incidentId}`,
    });

    await incidentLayer.load();

    incidentLayer
      .queryFeatures({
        returnGeometry: true,
        where: `incidentid='${this.incidentId}'`,
        spatialRelationship: "intersects",
        outFields: ["*"],
        outSpatialReference: { wkid: 4326 },
        orderByFields: [incidentLayer.objectIdField],
        maxAllowableOffset: 0,
        cacheHint: true,
      })
      .then((features) => {
        for (const feature of features.features) {
          if (feature.attributes) {
            this.reportLoc = feature.geometry as Point;
            return feature.attributes;
          }
        }
      })
      .then((attributes) => {
        const rptMessage: ReportMessage = this._makeIncidentMessage(attributes);
        this.postMissionMessage(rptMessage).then((result) => {
          if (result) {
            this.renderState = "success";
          }
        });
      })
      .catch((err) => {
        console.log("error received ::", err);
      });
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
            x: this.reportLoc.x,
            y: this.reportLoc.y,
          },
        },
      },
    };
  };

  private _makeIncidentMessage = (incidentFeature: IncidentFeature): ReportMessage => {
    const { incidentname, incidentdescription, incidentsource, incidenttype } = incidentFeature;
    const attr = {
      report_type: this.reportType,
      report_item_id: this.reportItemId,
      created_user: this.appModel.portal.user.username,
      mission_id: this.missionId,
      stale_time: REPORT_STALE_TIME,
      created_data: new Date().getTime(),
      single_line_text_y8ukazdlrbn: incidentname,
      single_line_text_jxyk0mwycr: incidenttype,
      single_line_text_tg2621vtbrr: incidentdescription,
      single_line_text_9q2n4rcmvzh: incidentsource,
    };

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
            x: this.reportLoc.x,
            y: this.reportLoc.y,
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
    this.mapId = this.activeMissionInfo.mapIds[0];

    const reportService: FeatureLayer = new FeatureLayer({
      url: this.reportUrl,
    });
    await reportService.load();

    if (this.reportType === appConfig.incidentReportName) {
      this.renderState = "incident";
    } else {
      const isSupportedReportForm = this._validateReportQuestions(this.activeMissionReportFormData.questions);

      if (isSupportedReportForm) {
        this.renderState = "supported";
      } else {
        this.renderState = "unsupported";
      }
    }

    this.ready = true;
  };

  private _validateReportQuestions = (questions: MissionReportQuestion[]): boolean => {
    let isSupported = true;

    for (const question of questions) {
      const inputType: string = question.type;
      if (SUPPORTED_FIELD_TYPES.indexOf(inputType) === -1) {
        isSupported = false;
        break;
      }
    }

    return isSupported;
  };
}

export default ReportFormViewModel;
