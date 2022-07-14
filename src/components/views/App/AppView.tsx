// arcgis.core
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// arcgis.core.core
import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";

// arcgis.core.portal
import PortalUser from "@arcgis/core/portal/PortalUser";

// views
import Missions from "../Missions/Missions";
import Reports from "../Reports/Reports";
import ReportForm from "../ReportForm/ReportForm";
import Tasks from "../Tasks/Tasks";
import EsriMap from "../Map/Map";
import AppModel from "../../../model/AppModel";

// appview.ui
import { makeHeader } from "./layout/Header";
import { makeNavbar } from "./layout/Navbar";
import { makeSignedInAlert } from "./layout/Alert";

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

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  appModel: AppModel = AppModel.getInstance();

  @property()
  activeComponent: Widget;

  @property()
  isDarkTheme = true;

  @property()
  title: string;

  @aliasOf("appModel.loggedInUser")
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
      case "reportform":
        this.activeComponent = this._getReportFormComponent(contentDiv);
        break;
      case "tasks":
        this.activeComponent = this._getTasksComponent(contentDiv);
        break;
      case "map":
        this.activeComponent = this._getMapComponent(contentDiv);
        break;
      default:
        return;
    }
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
    });
  };

  private _getReportsComponent = (div: HTMLDivElement) => {
    return new Reports({
      container: div,
      id: "reports",
      title: "Active Mission Reports",
    });
  };

  private _getReportFormComponent = (div: HTMLDivElement) => {
    return new ReportForm({
      container: div,
      id: "reportform",
      title: "Active Mission Report Form",
    });
  };

  private _getTasksComponent = (div: HTMLDivElement) => {
    return new Tasks({
      container: div,
      id: "tasks",
      title: "Mission Tasks",
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
