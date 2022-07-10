import { tsx } from "@arcgis/core/widgets/support/widget";

import PortalItem from "@arcgis/core/portal/PortalItem";

const CSS = {
  reportTileContainer: "report-tile-container",
  reportTile: "report-tile",
};

export const makeReportItemTile = (item: PortalItem) => {
  const { description, title } = item;
  const tile = item ? (
    <div class={CSS.reportTileContainer}>
      <calcite-tile class={CSS.reportTile} icon="file-report" heading={title} description={description}></calcite-tile>
    </div>
  ) : null;
  return tile;
};
