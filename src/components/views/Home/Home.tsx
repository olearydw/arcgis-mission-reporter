import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

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
  }

  postInitialize() {
    //console.log("home route post init");
  }

  destroy() {
    //console.log("home route destroy");
  }

  //--------------------------------------------------------------------
  //  Properties
  //--------------------------------------------------------------------

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
