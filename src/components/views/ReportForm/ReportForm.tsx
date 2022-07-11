import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// components.views.ReportForm
import ReportFormViewModel from "./ReportFormViewModel";
import { MissionReportData, MissionServiceInfo } from "../../../typings/mission";
import { makeFormElement } from "./layouts/FormFields";
//import { watch } from "@arcgis/core/core/reactiveUtils";

// References the CSS class name set in style.css
const CSS = {
  reportFormContainer: "report-form-container",
  formBase: "report-form-base",
  formQuestionContainer: "report-question-container",

  leader1: "leader-1",
  trailer1: "trailer-1",
  fontSmall: "font-size-small",
};

type MapProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("src.components.views.ReportForm.ReportForm")
class ReportForm extends Widget {
  // The params are optional
  constructor(params?: MapProperties) {
    super(params);
    this.viewModel = new ReportFormViewModel();
  }

  postInitialize() {
    // console.log("map post init");
    //console.log("view post init ::", this.title);
    //console.log("data ::", this.activeMissionReportFormData?.header?.content);
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

  @aliasOf("viewModel.ready")
  ready: boolean;

  @aliasOf("viewModel.subTitle")
  subtitle: string;

  @aliasOf("viewModel.title")
  title: string;

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    if (!this.ready) {
      return <div>Show loader</div>;
    } else {
      const { questions, reportType } = this.activeMissionReportFormData ?? {};
      const formElements = questions.map((question) => {
        return makeFormElement(question);
      });
      return (
        <div key={"map-container-key"} id={"view"} class={CSS.reportFormContainer}>
          <p class={CSS.trailer1}>{reportType ?? this.title}</p>
          <p class={this.classes(CSS.leader1, CSS.trailer1, CSS.fontSmall)}>{this.subtitle}</p>
          <div class={this.classes(CSS.formBase, CSS.leader1, CSS.trailer1)}>
            <form id="form" onsubmit={this._handleFormSubmit}>
              <fieldset>{formElements}</fieldset>
              <calcite-button id="submit" type="submit">
                Submit
              </calcite-button>
            </form>
          </div>
        </div>
      );
    }
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
  private _handleFormSubmit = (evt: Event) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    this.viewModel.processFormData(formData).then((result: boolean) => {
      console.log("submit result ::", result);
      form.reset();
    });
  };
}
export default ReportForm;
