// arcgis.core
import Graphic from "@arcgis/core/Graphic";
import WebMap from "@arcgis/core/WebMap";

// arcgis.core.core
import {
  subclass,
  property,
  aliasOf
} from "@arcgis/core/core/accessorSupport/decorators";

// arcgis.core.geometry
import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

// arcgis.core.views
import MapView from "@arcgis/core/views/MapView";

// arcgis.core.widgets
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// components.views.ReportForm
import ReportFormViewModel from "./ReportFormViewModel";

// components.views.ReportForm.layouts
import { makeFormElement } from "./layouts/FormFields";

// router
import { setRoute } from "../../../router/router";

// typings
import { RenderState } from "../../../typings/app";
import {
  MissionReportData,
  MissionServiceInfo
} from "../../../typings/mission";

// component styles
const CSS = {
  reportFormContainer: "report-form-container",
  formBase: "report-form-base",
  formQuestionContainer: "report-question-container",

  leader1: "leader-1",
  trailer1: "trailer-1",
  fontSmall: "font-size-small"
};

const markerSymbol = {
  type: "simple-marker",
  color: [226, 119, 40],
  outline: {
    color: [255, 255, 255],
    width: 2
  }
};

type ComponentProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("src.components.views.ReportForm.ReportForm")
class ReportForm extends Widget {
  constructor(params?: ComponentProperties) {
    super(params);
    this.viewModel = new ReportFormViewModel();
  }

  postInitialize() {
    if (this.activeMissionReportFormData) {
      this.title = this.activeMissionReportFormData?.header?.content;
      this.subtitle = this.activeMissionReportFormData?.subHeader?.content;
    }
  }

  destroy() {
    // console.log("map destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------
  @property()
  viewModel: ReportFormViewModel;

  @aliasOf("viewModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("viewModel.activeMissionReportFormData")
  activeMissionReportFormData: MissionReportData;

  @aliasOf("viewModel.incidentId")
  incidentId: string;

  @aliasOf("viewModel.incidentGraphics")
  incidentGraphics: Graphic[];

  @aliasOf("viewModel.mapId")
  mapId: string;

  @aliasOf("viewModel.ready")
  ready: boolean;

  @aliasOf("viewModel.renderState")
  renderState: RenderState;

  @aliasOf("viewModel.reportLoc")
  reportLoc: Point;

  @aliasOf("viewModel.subTitle")
  subtitle: string;

  @aliasOf("viewModel.title")
  title: string;

  @property()
  view: MapView;

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    // conditional rendering switch
    switch (this.renderState) {
      case "loading":
        return this._renderLoading();
      case "supported":
        return this._renderReportForm();
      case "success":
        return this._renderSuccess();
      case "incident":
        return this._renderIncidentForm();
      case "unsupported":
        return this._renderUnsupported();
      default:
        setRoute();
    }
  }

  //-------------------------------------------------------------------
  //  Conditional rendering methods
  //-------------------------------------------------------------------
  private _renderLoading = () => {
    return (
      <div key={"loader"}>
        <calcite-loader
          active={"true"}
          label="Loading view"
          scale="m"
          text="Loading incident data..."
        ></calcite-loader>
      </div>
    );
  };

  private _renderUnsupported = () => {
    return (
      <div>
        <h5>Unsupported Report</h5>
        <p>
          This report contains form elements not yet supported by the
          application.
        </p>
        <div class={"form-action-container"}>
          <calcite-button
            icon-end="arrow-up-right"
            icon-start="file-report"
            label="Return to Reports List"
            width="half"
          >
            Return to Reports List
          </calcite-button>
        </div>
      </div>
    );
  };

  private _renderReportForm = () => {
    const { questions, reportType } = this.activeMissionReportFormData ?? {};
    const submitEnabled = !!this.reportLoc;
    const formElements = questions.map((question) => {
      return makeFormElement(question);
    });

    return (
      <div
        key={"map-container-key"}
        id={"view"}
        class={CSS.reportFormContainer}
      >
        <p class={CSS.trailer1}>{reportType ?? this.title}</p>
        <p class={this.classes(CSS.leader1, CSS.trailer1, CSS.fontSmall)}>
          {this.subtitle}
        </p>
        <div class={this.classes(CSS.formBase, CSS.leader1, CSS.trailer1)}>
          <form id="form" onsubmit={this._handleFormSubmit}>
            <fieldset>{formElements}</fieldset>
            <div
              id={"mapDiv"}
              class={"report-form-map"}
              afterCreate={this._startMap}
            />
            <div class={"form-action-container"}>
              <calcite-action
                text="Cancel"
                text-enabled={"true"}
                color="neutral"
                scale={"s"}
                appearance="solid"
                icon="arrow-left"
                onclick={this._handleCancelAction}
              ></calcite-action>
              <calcite-button
                id="submit"
                type="submit"
                scale={"s"}
                disabled={!submitEnabled}
              >
                Submit
              </calcite-button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  private _renderIncidentForm = () => {
    const { reportType } = this.activeMissionReportFormData ?? {};

    const selectOptions = this.incidentGraphics.length
      ? this.incidentGraphics.map((incident) => {
          const attr = incident.attributes;
          return (
            <calcite-option label={attr.incidentname} value={attr.incidentid}>
              {attr.incidentname}
            </calcite-option>
          );
        })
      : null;

    return (
      <div key={"incident-report-key"} class={CSS.reportFormContainer}>
        <p class={CSS.trailer1}>{reportType ?? this.title}</p>
        <p class={this.classes(CSS.leader1, CSS.trailer1, CSS.fontSmall)}>
          {this.subtitle}
        </p>

        <div class={this.classes(CSS.formBase, CSS.leader1, CSS.trailer1)}>
          <form
            id={"incident-form"}
            onsubmit={this._handleIncidentSubmitAction}
          >
            <fieldset>
              <calcite-label for={"incident-select"}>
                Select Incident to Report:
              </calcite-label>
              <calcite-select
                label={"incident-selector"}
                id={"incident-select"}
                name={"incident"}
              >
                {selectOptions}
              </calcite-select>
            </fieldset>
            <div class={"form-action-container"}>
              <calcite-button id="submit" type="submit" scale={"m"}>
                Send Incident Report
              </calcite-button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  private _renderSuccess = () => {
    return (
      <div class={"success-container"}>
        <h5>
          The report was successfully submitted. Returning you to the reports
          list...
        </h5>
        <div
          class={"form-action-container leader-1 trailer-1"}
          afterCreate={this._handleSuccessComplete}
        >
          <calcite-button
            icon-end="arrow-up-right"
            //icon-start="file-report"
            label="Return to Reports List"
            width="half"
          >
            Mission Reports List
          </calcite-button>
        </div>
      </div>
    );
  };

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
  private _handleFormSubmit = (evt: Event) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    this.viewModel.processFormData(formData).then((result: boolean) => {
      form.reset();
      this.view.graphics.removeAll();
    });
  };

  private _handleSuccessComplete = () => {
    setTimeout(() => {
      setRoute("reports");
    }, 3000);
  };

  private _handleCancelAction = () => {
    setRoute();
  };

  private _handleIncidentSubmitAction = async (evt: Event) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    for (const data of formData.entries()) {
      this.incidentId = data[1] as string;
    }

    if (!this.incidentId) {
      return;
    }

    try {
      const success = await this.viewModel.makeIncidentReport(this.incidentId);
      if (success) {
        this.renderState = "success";
      }
    } catch (e) {
      console.log("error creating incident report ::", e);
    }
  };

  private _startMap = async (elem: HTMLDivElement) => {
    const webmap = new WebMap({
      portalItem: {
        id: this.mapId
      }
    });

    this.view = new MapView({
      container: elem,
      map: webmap,
      ui: {
        components: ["zoom"]
      }
    });

    await webmap.when().then(() => {
      this.view.on("click", (evt) => {
        this.view.graphics.removeAll();
        this.reportLoc = webMercatorUtils.webMercatorToGeographic(
          evt.mapPoint,
          false
        ) as Point;
        const pointGraphic = new Graphic({
          geometry: this.reportLoc,
          symbol: markerSymbol
        });

        this.view.graphics.add(pointGraphic);
      });
    });
  };
}
export default ReportForm;
