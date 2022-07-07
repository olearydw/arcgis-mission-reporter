import { tsx } from "@arcgis/core/widgets/support/widget";

// arcgis.core.portal
import PortalUser from "@arcgis/core/portal/PortalUser";

export const makeSignedInAlert = (user: PortalUser) => {
  return user ? (
    <calcite-alert
      active="true"
      auto-dismiss="true"
      dismissable="true"
      auto-dismiss-duration="fast"
      icon="globe"
      placement="bottom-end"
      scale="s"
    >
      <div slot="title">Sign In Successful</div>
      <div slot="message">{`Welcome ${user?.fullName ?? ""}`}</div>
    </calcite-alert>
  ) : null;
};
