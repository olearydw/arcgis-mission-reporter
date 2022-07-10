import { tsx } from "@arcgis/core/widgets/support/widget";

import {MissionServiceInfo} from "../../../../typings/mission";

export const makeMissionCard = (missionSvcInfo: MissionServiceInfo, thumbnailUrl: string) => {
  const { created, description, modified, owner, snippet, title } = missionSvcInfo;
  return (
    <calcite-card thumbnail-position="inline-start">
      <img src={thumbnailUrl} slot="thumbnail" alt=""></img>
      <div slot="title">{title}</div>
      <div slot="subtitle">{snippet}</div>
      <div slot="description">{description}</div>
      <div>Created: {new Date(created)}</div>
      <div>Updated: {new Date(modified)}</div>
      <div>Mission Report Creator: {owner}</div>
    </calcite-card>
  );
};
