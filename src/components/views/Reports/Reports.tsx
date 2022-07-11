import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// components.views.Reports
import ReportsViewModel from "./ReportsViewModel";

import { MissionServiceInfo } from "../../../typings/mission";
import PortalItem from "@arcgis/core/portal/PortalItem";

import { makeReportItemTile } from "./layouts/ReportTile";
import { makeMissionCard } from "./layouts/ReportCard";
import { setRoute } from "../../../router/router";

// References the CSS class name set in style.css
const CSS = {
  reportsContainer: "reports-container",
  reportsContent: "reports-content",
  reportItems: "reports-list",
  reportItemCard: "report-item-card",

  leader1: "leader-1",
  trailer1: "trailer-1",
};

type ReportsProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.Reports")
class Reports extends Widget {
  // The params are optional
  constructor(params?: ReportsProperties) {
    super(params);
    this.viewModel = new ReportsViewModel();
  }

  postInitialize() {
    //console.log("list post init");
    //this._initComponent();
  }

  destroy() {
    //console.log("list destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  viewModel: ReportsViewModel;

  @aliasOf("viewModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("viewModel.activeMissionThumbnailUrl")
  activeMissionThumbnailUrl: string;

  @aliasOf("viewModel.activeMissionReportId")
  activeMissionReportId: string;

  @aliasOf("viewModel.ready")
  ready: boolean;

  @aliasOf("viewModel.reportItems")
  reportItems: PortalItem[];

  @property()
  title: string;

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    const title = this.title ? this.title : "Reports of portal items goes here...";
    const content = this._getViewContent();
    return (
      <div class={CSS.reportsContainer}>
        <p class={CSS.trailer1}>{title}</p>
        {content}
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
  private _getViewContent = () => {
    if (!this.ready) {
      return <calcite-loader active scale="l" text="Loading Active Reports" type="indeterminate" />;
    } else {
      return this.reportItems.length ? this._renderReports() : this._renderNoReports();
    }
  };

  private _renderReports = () => {
    const reportTiles = this.reportItems.map((item) => {
      return makeReportItemTile({
        item: item,
        handler: this._handleReportClick,
      });
    });
    const activeMissionCard = makeMissionCard(this.activeMissionInfo, this.activeMissionThumbnailUrl);
    return (
      <div class={CSS.reportsContent}>
        <p class={this.classes(CSS.leader1, CSS.trailer1)}>
          There are {this.reportItems.length} active reports available for this mission.
        </p>
        <div class={CSS.reportItems}>{reportTiles}</div>
        <div class={this.classes(CSS.reportItemCard, CSS.leader1, CSS.trailer1)}>
          <p>Selected Mission:</p>
          {activeMissionCard}
        </div>
      </div>
    );
  };

  private _renderNoReports = () => {
    return <h4>There are no active reports for this mission.</h4>;
  };

  private _handleReportClick = async (evt: Event) => {
    const elem = evt.target as HTMLCalciteTileElement;
    const reportId = elem.getAttribute("data-id");
    if (reportId) {
      this.activeMissionReportId = reportId;
      await this.viewModel.getReportDetails(reportId);
      setRoute(`report/${reportId}`);
    }
  };
}
export default Reports;
