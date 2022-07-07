import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// References the CSS class name set in style.css
const CSS = {
  listContainer: "list-container",
};

type ListProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("esri.widgets.List")
class List extends Widget {
  // The params are optional
  constructor(params?: ListProperties) {
    super(params);
  }

  postInitialize() {
    //console.log("list post init");
  }

  destroy() {
    //console.log("list destroy");
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
    const title = this.title ? this.title : "List of portal items goes here...";
    return (
      <div class={CSS.listContainer}>
        <p>{title}</p>
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
}
export default List;
