import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import AppModel from "../../../model/AppModel";
import {FederatedServer} from "../../../typings/portal";
import {getFederatedServer} from "../../../utilities/portal/instance";

// References the CSS class name set in style.css
const CSS = {
  homeContainer: "home-container",
};

type HomeProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.App")
class Home extends Widget {
  // The params are optional
  constructor(params?: HomeProperties) {
    super(params);
    this.model = AppModel.getInstance();
  }

  postInitialize() {
    //console.log("home route post init");
    console.log("pi model ::",this.model?.federatedServers);
    this.missionServerInfo=getFederatedServer("MissionServer");
    console.log("mission svr ::",this.missionServerInfo);
  }

  destroy() {
    //console.log("home route destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------
  @property()
  missionServerInfo: FederatedServer|null;

  @property()
  model: AppModel;

  @property()
  title: string;

  //@property()
  //@messageBundle("/esm-widget-vite/assets/t9n/widget")
  //messages: { title: string; };

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    return (
      <div class={CSS.homeContainer}>
        <p>{this.title ? this.title : "Home Page Title"}</p>
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
}
export default Home;
