import { aliasOf, subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
//import AppModel from "../../../model/AppModel";
import { FederatedServer } from "../../../typings/portal";
import PortalUser from "@arcgis/core/portal/PortalUser";
import { MissionServiceBase, MissionServiceInfo } from "../../../typings/mission";
import { getActiveMissionInfo, getAllMissions, getMissionServiceInfo } from "../../../mediators/MissionMediator";
import HomeViewModel from "./HomeViewModel";

//import * as watchUtils from "@arcgis/core/core/watchUtils";

// References the CSS class name set in style.css
const CSS = {
  homeContainer: "home-container",
};

type HomeProperties = {
  title?: string;
  user?: PortalUser;
} & __esri.WidgetProperties;

@subclass("esri.widgets.App")
class Home extends Widget {
  // The params are optional
  constructor(params?: HomeProperties) {
    super(params);
    //this.model = AppModel.getInstance();
    this.viewModel = new HomeViewModel();
  }

  async postInitialize() {
    this._initWatchers();

    this.watch("activeMissionId", (val) => {
      console.log("classic watcher fired ::", val);
    });

    reactiveUtils.watch(
      () => this.ready,
      () => {
        console.log("ready callback fired ::");
      },
    );

    this.loaded = await this._initComponent();

    this.ready = true;

    this.scheduleRender();

    //this.notifyChange("loaded");
  }

  destroy() {
    //console.log("home route destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  viewModel: HomeViewModel;

  @aliasOf("viewModel.activeMissionId")
  activeMissionId: string;

  @property()
  activeMissionInfo: MissionServiceInfo;

  @aliasOf("viewModel.loaded")
  loaded: boolean;

  @property()
  missionServerInfo: FederatedServer | null;

  @property()
  missionServicesList: MissionServiceBase[] = [];

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

    const title = <p>{this.title ? this.title : "Home Page Title"}</p>;
    const missionList = this._makeMissionList();

    return (
      <div class={CSS.homeContainer}>
        {title}
        {missionList}
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  private _initComponent = async (): Promise<boolean> => {
    try {
      // fetch list of all published mission services
      this.missionServicesList = await getAllMissions();

      //this.activeMissionId = getActiveMission
      this.activeMissionInfo = getActiveMissionInfo();

      console.log("active info from model ::", getActiveMissionInfo());

      if (this.activeMissionInfo) {
        this.viewModel.activeMissionId = this.activeMissionInfo.missionId;
        console.log("vm ::", this.viewModel);
      }

      // component is ready
      return true;
    } catch (e) {
      // no missions available
      return false;
    }
  };

  private _initWatchers = () => {
    console.log("start watchers", this);

    reactiveUtils.watch(
      // getValue function
      () => this.ready,
      // callback
      (val) => {
        console.log("ready ::", val);
      },
    );

    reactiveUtils.watch(
      () => this.loaded,
      (val) => {
        console.log("loaded change ::", this.loaded, val);
      },
    );

    reactiveUtils.watch(
      () => this.activeMissionId,
      () => {
        console.log(`Active Mission Changed: ${this.activeMissionId}`);
      },
    );

    this.watch("activeMissionId", (val) => {
      console.log("classic watcher fired ::", val);
    });
  };

  private _listItemSelect = (evt: Event) => {
    const elem = evt.target as HTMLCalcitePickListItemElement;
    if (!elem.value || elem.value === this.activeMissionId) {
      return;
    }
    this.activeMissionId = elem.value;

    // this should be triggered by watching activeMissionId change
    this._setMissionDetails(this.activeMissionId);
  };

  //--------------------------
  // Method for making UI elements
  //------------------------

  private _makeMissionList = () => {
    const listItems = this.missionServicesList.map((service) => {
      console.log("active mission ::", this.activeMissionId);
      console.log("home view this ::", this);
      const isSelected = service.name === this.activeMissionId;
      const desc = `Mission ID: ${service.name}}`;
      return (
        <calcite-pick-list-item label={service.title} description={desc} selected={isSelected} value={service.name}>
          <calcite-action slot="actions-end" icon="layer"></calcite-action>
        </calcite-pick-list-item>
      );
    });

    return (
      <calcite-pick-list key={"mission-svc-list"} onclick={this._listItemSelect}>
        {listItems}
      </calcite-pick-list>
    );
  };

  private async _setMissionDetails(missionId: string) {
    const missionServiceInfo = await getMissionServiceInfo(missionId);
    this.activeMissionInfo = missionServiceInfo;
    this.scheduleRender();
  }
}
export default Home;
