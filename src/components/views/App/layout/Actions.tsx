import PortalUser from "@arcgis/core/portal/PortalUser";
import { tsx } from "@arcgis/core/widgets/support/widget";

export const makeSignedInAlert = (props: PortalUser) => {
  const displayName = props.fullName ?? "";
  return (
    <calcite-alert
      active
      auto-dismiss
      auto-dismiss-duration="medium"
      icon="globe"
      placement="bottom-end"
      scale="s"
    >
      <div slot="title">Sign In Successful</div>
      <div slot="message">{`Welcome ${displayName}`}</div>
    </calcite-alert>
  );
};
