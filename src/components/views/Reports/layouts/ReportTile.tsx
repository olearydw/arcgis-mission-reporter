import { tsx } from "@arcgis/core/widgets/support/widget";

import PortalItem from "@arcgis/core/portal/PortalItem";

const CSS = {
  reportTileContainer: "report-tile-container",
  reportTile: "report-tile",
};

type MakeReportTileProperties = {
  item: PortalItem;
  handler: (evt: Event) => void;
};

export const makeReportItemTile = (props: MakeReportTileProperties) => {
  const { description, id, title } = props.item;
  const tile = props.item ? (
    <div class={CSS.reportTileContainer} onclick={props.handler}>
      <calcite-tile
        class={CSS.reportTile}
        icon="file-report"
        heading={title}
        description={description}
        data-id={id}
      ></calcite-tile>
    </div>
  ) : null;
  return tile;
};
