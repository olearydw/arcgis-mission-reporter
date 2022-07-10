import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// components.views.Reports
import ReportsViewModel from "./ReportsViewModel";

import { MissionServiceInfo } from "../../../typings/mission";
import PortalItem from "@arcgis/core/portal/PortalItem";

import { makeReportItemTile } from "./layouts/ReportTile";
import {makeMissionCard} from "./layouts/ReportCard";

// References the CSS class name set in style.css
const CSS = {
  reportsContainer: "reports-container",
  trailer1: "trailer-1",
};

type ListProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.Reports")
class Reports extends Widget {
  // The params are optional
  constructor(params?: ListProperties) {
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
      return makeReportItemTile(item);
    });
    const activeMissionCard = makeMissionCard(this.activeMissionInfo, this.activeMissionThumbnailUrl);
    return (
      <div class={"foo bar"}>
        <h5>There are {this.reportItems.length} active reports available for this mission.</h5>
        <div class={"report-items"}>
          {reportTiles}
        </div>
        <div class={"mission-card-reports leader-1 trailer-1"}>
          <p>Selected Mission:</p>
          {activeMissionCard}
        </div>
        
      </div>
    );
  };

  private _renderNoReports = () => {
    return <h4>There are no active reports for this mission.</h4>;
  };
}
export default Reports;
