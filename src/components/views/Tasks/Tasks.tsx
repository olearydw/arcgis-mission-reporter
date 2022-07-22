import {
  subclass,
  property
} from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";

// References the CSS class name set in style.css
const CSS = {
  tasksContainer: "tasks-container"
};

type TasksProperties = {
  title?: string;
} & __esri.WidgetProperties;

@subclass("src.components.views.Tasks.Tasks")
class Tasks extends Widget {
  // The params are optional
  constructor(params?: TasksProperties) {
    super(params);
  }

  postInitialize() {
    // console.log("tasks view post init");
  }

  destroy() {
    // console.log("tasks view destroy");
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
    const title = this.title ? this.title : "Mission Tasks";
    return (
      <div key={"tasks-container-key"} class={CSS.tasksContainer}>
        <p>{title}</p>
      </div>
    );
  }

  //-------------------------------------------------------------------
  //  Private methods
  //-------------------------------------------------------------------
}
export default Tasks;
