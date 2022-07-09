import { aliasOf, property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

import PortalUser from "@arcgis/core/portal/PortalUser";
import { MissionServiceBase, MissionServiceInfo } from "../../../typings/mission";
import { getMissionServiceInfo } from "../../../mediators/MissionMediator";
import MissionsViewModel from "./MissionsViewModel";
//import * as watchUtils from "@arcgis/core/core/watchUtils";

//import * as watchUtils from "@arcgis/core/core/watchUtils";

// References the CSS class name set in style.css
const CSS = {
  missionsContainer: "missions-container",

  leader1: "leader-1",
  trailer1: "trailer-1",
};

type MissionProperties = {
  title?: string;
  user?: PortalUser;
} & __esri.WidgetProperties;

@subclass("esri.widgets.App")
class Missions extends Widget {
  // The params are optional
  constructor(params?: MissionProperties) {
    super(params);
    this.viewModel = new MissionsViewModel();
  }

  async postInitialize() {
    this.loaded = await this.viewModel.initComponent();

    this.ready = true;

    this.scheduleRender();
    // this._initWatchers();
    //
    // this.watch("activeMissionId", (val) => {
    //   console.log("classic watcher fired ::", val);
    // });
    //
    // watchUtils.watch(this, "ready", (val) => {
    //   console.log("ready change ::", this.ready);
    // });
    //
    // reactiveUtils.watch(
    //   () => this.ready,
    //   () => {
    //     console.log("ready callback fired ::");
    //   },
    // );

    //this.loaded = await this._initComponent();

    //this.ready = true;

    //this.scheduleRender();

    //this.notifyChange("loaded");

    // reactiveUtils
    //   .whenOnce(() => this.ready)
    //   .then((value) => {
    //     console.log(`component is ready`);
    //   });
  }

  destroy() {
    //console.log("home route destroy");
  }

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

  // @property()
  // missionServerInfo: FederatedServer | null;

  @aliasOf("viewModel.missionServicesList")
  get missionServicesList(): MissionServiceBase[] {
    return this.viewModel.missionServicesList;
  }

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
    console.log("renderer ::", this.ready);

    if (!this.ready) {
      return <div key={"not-ready-div"} />;
    }

    const title = (
      <p class={this.classes(CSS.leader1, CSS.trailer1)}>{this.title ? this.title : "Missions Page Title"}</p>
    );
    const missionList = this._makeMissionList();

    return (
      <div class={CSS.missionsContainer}>
        {title}
        {missionList}
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  // private _initComponent = async (): Promise<boolean> => {
  //   try {
  //     // fetch list of all published mission services
  //     this.missionServicesList = await getAllMissions();
  //
  //     //this.activeMissionId = getActiveMission
  //     this.activeMissionInfo = getActiveMissionInfo();
  //
  //     if (this.activeMissionInfo) {
  //       this.viewModel.activeMissionId = this.activeMissionInfo.missionId;
  //     }
  //
  //     // component is ready
  //     return true;
  //   } catch (e) {
  //     // no missions available
  //     return false;
  //   }
  // };

  // private _initWatchers = () => {
  //   console.log("start watchers", this);
  //
  //   reactiveUtils.watch(
  //     // getValue function
  //     () => this.ready,
  //     // callback
  //     (val) => {
  //       console.log("ready ::", val);
  //     },
  //   );
  //
  //   reactiveUtils.watch(
  //     () => this.loaded,
  //     (val) => {
  //       console.log("loaded change ::", this.loaded, val);
  //     },
  //   );
  //
  //   reactiveUtils.watch(
  //     () => this.activeMissionId,
  //     () => {
  //       console.log(`Active Mission Changed: ${this.activeMissionId}`);
  //     },
  //   );
  //
  //   this.watch("activeMissionId", (val) => {
  //     console.log("classic watcher fired ::", val);
  //   });
  // };

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
    console.log("view ::", this);
    console.log("vm ::", this.viewModel);

    //console.log("list ::", this.missionServicesList);

    const listItems = this.viewModel.missionServicesList.map((service) => {
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
export default Missions;
