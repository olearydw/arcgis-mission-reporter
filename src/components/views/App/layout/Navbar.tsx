import { tsx } from "@arcgis/core/widgets/support/widget";
import { setRoute } from "../../../../router/router";

const CSS = {
  navContainer: "navbar-container",
};

export const makeNavbar = () => {
  return (
    <div class={CSS.navContainer}>
      <calcite-action-bar>
        <calcite-action text="Home" icon="home" data-action={"/home"} onclick={_handleClick}></calcite-action>
        <calcite-action text="Webmap" icon="map" data-action={"/map"} onclick={_handleClick}></calcite-action>
        <calcite-action text="Item List" icon="list" data-action={"/list"} onclick={_handleClick}></calcite-action>
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
