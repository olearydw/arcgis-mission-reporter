import { tsx } from "@arcgis/core/widgets/support/widget";
import { setRoute } from "../../../../router/router";

const CSS = {
  navContainer: "navbar-container"
};

export const makeNavbar = () => {
  return (
    <div class={CSS.navContainer}>
      <calcite-action-bar>
        <calcite-action
          text="Missions"
          icon="home"
          data-action={"/missions"}
          onclick={_handleClick}
        ></calcite-action>
        <calcite-action
          text="Reports"
          icon="file-report"
          data-action={"/reports"}
          onclick={_handleClick}
        ></calcite-action>
        <calcite-action
          text="Tasks"
          icon="list"
          data-action={"/tasks"}
          onclick={_handleClick}
        ></calcite-action>
        <calcite-action
          text="Webmap"
          icon="map"
          data-action={"/map"}
          onclick={_handleClick}
        ></calcite-action>
      </calcite-action-bar>
    </div>
  );
};

function _handleClick(evt: Event) {
  const actionElem = evt.target as HTMLCalciteActionElement;
  const action = actionElem.getAttribute("data-action");
  if (action) {
    setRoute(action);
  }
}
