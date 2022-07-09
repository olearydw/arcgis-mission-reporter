import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// References the CSS class name set in style.css
const CSS = {
  mapContainer: "list-container",
};

type MapProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.Reports")
class Map extends Widget {
  // The params are optional
  constructor(params?: MapProperties) {
    super(params);
  }

  postInitialize() {
    // console.log("map post init");
  }

  destroy() {
    // console.log("map destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

  @property()
  title: string;

  //-------------------------------------------------------------------
  //  Public methods
  //-------------------------------------------------------------------

  render() {
    const title = this.title ? this.title : "Mission task list and map goes here...";
    return (
      <div key={"map-container-key"} id={"view"} class={CSS.mapContainer}>
        <p>{title}</p>
        <div id={"mapview"}>map</div>
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
}
export default Map;
