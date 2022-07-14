// arcgis.core
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Handles from "@arcgis/core/core/Handles";

// arcgis.core.core
import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import { watch } from "@arcgis/core/core/reactiveUtils";

// arcgis.core.portal
import PortalUser from "@arcgis/core/portal/PortalUser";

// components.views.Missions
import MissionsViewModel from "./MissionsViewModel";

// typings
import { MissionServiceBase, MissionServiceInfo } from "../../../typings/mission";
import { getMissionServiceInfo } from "../../../mediators/MissionMediator";
import { setRoute } from "../../../router/router";

// References the CSS class name set in style.css
const CSS = {
  missionsContainer: "missions-container",
  cardActionsEnd: "card-actions-end",

  leader1: "leader-1",
  trailer1: "trailer-1",
};

type MissionProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.App")
class Missions extends Widget {
  // The params are optional
  constructor(params?: MissionProperties) {
    super(params);
    this.viewModel = new MissionsViewModel();
  }

  async postInitialize() {
    // start watchers
    this._initWatchers();
  }

  destroy() {
    if (this._handles) {
      this._handles.destroy();
      this._handles = null;
    }
  }

  //--------------------------------------------------------------------
  //  Private properties
  //--------------------------------------------------------------------

  private _handles: Handles = new Handles();

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  viewModel: MissionsViewModel;

  @aliasOf("viewModel.activeMissionId")
  activeMissionId: string;

  @aliasOf("viewModel.activeMissionInfo")
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("viewModel.loaded")
  loaded: boolean;

  @aliasOf("viewModel.missionServicesList")
  missionServicesList: MissionServiceBase[];

  @aliasOf("viewModel.ready")
  ready: boolean;

  @property()
  title: string;

  @aliasOf("viewModel.user")
  user: PortalUser;

  //@property()
  //@messageBundle("/esm-widget-vite/assets/t9n/widget")
  //messages: { title: string; };

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    if (!this.ready) {
      return <div key={"not-ready-div"} />;
    }

    const title = <p class={CSS.trailer1}>{this.title ? this.title : "Missions List"}</p>;
    const missionList = this._makeMissionList();
    const activeMissionElem = this.activeMissionInfo ? this._makeActionMissionElement() : null;

    return (
      <div class={CSS.missionsContainer}>
        {title}
        {missionList}
        {activeMissionElem}
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  private _initWatchers = () => {
    this._handles.add(
      watch(
        () => this.activeMissionId,
        async (missionId) => {
          this.activeMissionInfo = await getMissionServiceInfo(missionId);
        },
      ),
    );
  };

  private _listItemSelect = (evt: Event) => {
    const elem = evt.target as HTMLCalcitePickListItemElement;
    if (!elem.value || elem.value === this.activeMissionId) {
      return;
    }
    this.activeMissionId = elem.value;
  };

  //--------------------------
  // Method for making UI elements
  //------------------------

  private _makeMissionList = () => {
    const listItems = this.missionServicesList.map((service) => {
      const isSelected = service.name === this.activeMissionId;
      const desc = `Mission ID: ${service.name}}`;
      return (
        <calcite-pick-list-item label={service.title} description={desc} selected={isSelected} value={service.name}>
          <calcite-action slot="actions-end" icon="layer"></calcite-action>
        </calcite-pick-list-item>
      );
    });

    return (
      <div class={"mission-list-container"}>
        <calcite-pick-list key={"mission-svc-list"} onclick={this._listItemSelect}>
          {listItems}
        </calcite-pick-list>
      </div>
    );
  };

  private _makeActionMissionElement = () => {
    const { created, missionId, thumbnail, snippet, title, modified, owner } = this.activeMissionInfo;
    const tnUrl = this.viewModel.getThumbnailUrl(missionId, thumbnail);
    return (
      <div id="card-container">
        <calcite-card thumbnail-position="inline-start">
          <img src={tnUrl} slot="thumbnail" alt=""></img>
          <div slot="title">{title}</div>
          <div slot="subtitle">{snippet}</div>
          <div>Created: {created}</div>
          <div>Updated: {modified}</div>
          <div>Mission Owner: {owner}</div>
          <div class={CSS.cardActionsEnd} slot="footer-trailing">
            <calcite-button
              color="inverse"
              appearance={"outline"}
              id="card-icon-test-1"
              icon-end="list"
              disabled={"true"}
              data-action={"tasks"}
              onclick={this._handleAction}
            >
              Create Task
            </calcite-button>
            <calcite-button
              //color="neutral"
              appearance={"outline"}
              id="card-icon-test-2"
              icon-end="file-report"
              data-action={"reports"}
              onclick={this._handleAction}
            >
              Send Report
            </calcite-button>
          </div>
        </calcite-card>
      </div>
    );
  };

  private _handleAction = (evt: Event) => {
    const elem = evt.target as HTMLCalciteActionElement;
    const action = elem.getAttribute("data-action");
    if (action) {
      setRoute(action);
    }
  };
}
export default Missions;
