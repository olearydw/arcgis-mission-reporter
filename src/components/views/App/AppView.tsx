// arcgis.core
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// arcgis.core.core
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";

// arcgis.core.portal
import PortalUser from "@arcgis/core/portal/PortalUser";

// views
import Missions from "../Missions/Missions";
import Reports from "../Reports/Reports";
import EsriMap from "../Map/Map";

// appview.ui
import { makeHeader } from "./layout/Header";
import { makeNavbar } from "./layout/Navbar";
import { makeSignedInAlert } from "./layout/Alert";
import { watch } from "@arcgis/core/core/reactiveUtils";

// Styles
const CSS = {
  appContainer: "app-container",
  navContainer: "navbar-container",
  contentWrapper: "content-wrapper",
  contentContainer: "content-container",

  // conditional styles
  darkTheme: "calcite-theme-dark",
};

type AppProperties = {
  title: string;
  user?: PortalUser;
} & __esri.WidgetProperties;

@subclass("esri.widgets.App")
class App extends Widget {
  constructor(params?: AppProperties) {
    super(params);
  }

  postInitialize() {
    // remove if not used
    watch(
      () => [this.user],
      () => {
        console.log("user change ::", this.user);
      },
    );

    this.watch("user", (user) => {
      console.log("user change ::", user);
    });
  }

  destroy() {
    //console.log("app view destroy called");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  activeComponent: Widget;

  @property()
  isDarkTheme = true;

  @property()
  title: string;

  @property()
  user: PortalUser;

  //@property()
  //@messageBundle("/esm-widget-vite/assets/t9n/widget")
  //messages: { title: string; };

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    const header = makeHeader(this.title, this.user);
    const navbar = makeNavbar();
    const welcomeNotice = makeSignedInAlert(this.user);
    const darkTheme = { [CSS.darkTheme]: this.isDarkTheme };

    console.log("app user ::", this.user);

    // const n: HTMLCalciteAlertElement = document.createElement("HTMLCalciteAlertElement");
    // n.active = true;
    // n.autoDismiss = true;

    // const notice = (
    //   <calcite-alert
    //     active="true"
    //     auto-dismiss="true"
    //     auto-dismiss-duration="medium"
    //     placement="bottom-end"
    //     scale="m"
    //     icon="globe"
    //   >
    //     <div slot="title">Alert title</div>
    //     <div slot="message">Message lorem ipsum</div>
    //     <a slot="link" href="#">
    //       Link slot
    //     </a>
    //   </calcite-alert>
    // );

    return (
      <div class={this.classes(CSS.appContainer, darkTheme)}>
        {header}
        <div id={"wrapper"} class={CSS.contentWrapper}>
          {navbar}
        </div>
        {welcomeNotice}
      </div>
    );
  }

  public setActiveView = (componentId: string) => {
    if (this.activeComponent) {
      this.activeComponent.destroy();
    }

    const contentDiv = this._getContentContainer();

    switch (componentId) {
      case "missions":
        this.activeComponent = this._getMissionsComponent(contentDiv);
        break;
      case "reports":
        this.activeComponent = this._getReportsComponent(contentDiv);
        break;
      case "map":
        this.activeComponent = this._getMapComponent(contentDiv);
        break;
      default:
        return;
    }
    this.activeComponent.render();
  };

  public setUser = (user: PortalUser) => {
    this.user = user;
    this.renderNow();
  };

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------

  private _getContentContainer = (): HTMLDivElement => {
    let contentNode: HTMLDivElement;
    const contentNodeId = "content";
    const targetNode: HTMLDivElement = document.getElementById("content") as HTMLDivElement;

    if (targetNode) {
      targetNode.replaceChildren();
      contentNode = targetNode;
    } else {
      contentNode = document.createElement("div");
      document.getElementById("wrapper")?.appendChild(contentNode);
    }

    contentNode.id = contentNodeId;
    contentNode.classList.add(CSS.contentContainer);
    return contentNode;
  };

  private _getMissionsComponent = (div: HTMLDivElement) => {
    return new Missions({
      container: div,
      id: "missions",
      title: "Active Missions",
      user: this.user,
    });
  };

  private _getReportsComponent = (div: HTMLDivElement) => {
    return new Reports({
      container: div,
      id: "list",
      title: "View the Mission Task Reports",
    });
  };

  private _getMapComponent = (div: HTMLDivElement) => {
    return new EsriMap({
      container: div,
      id: "map",
      title: "View the Mission Map",
    });
  };
}
export default App;
