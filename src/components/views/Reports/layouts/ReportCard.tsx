import { tsx } from "@arcgis/core/widgets/support/widget";

import { MissionServiceInfo } from "../../../../typings/mission";
import { formatDate } from "../../../../utilities/dateUtils";

export const makeMissionCard = (missionSvcInfo: MissionServiceInfo, thumbnailUrl: string) => {
  const { created, description, modified, owner, snippet, title } = missionSvcInfo;
  return (
    <calcite-card thumbnail-position="inline-start">
      <img src={thumbnailUrl} slot="thumbnail" alt=""></img>
      <div slot="title">{title}</div>
      <div slot="subtitle">{snippet}</div>
      <div slot="description">{description}</div>
      <div>Created: {formatDate(created)}</div>
      <div>Updated: {formatDate(modified)}</div>
      <div>Mission Report Creator: {owner}</div>
    </calcite-card>
  );
};
