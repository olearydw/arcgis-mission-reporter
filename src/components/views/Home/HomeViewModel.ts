import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from "@arcgis/core/core/Accessor";
import PortalUser from "@arcgis/core/portal/PortalUser";

@subclass("src.components.views.Home.HomeViewModel")
class HomeViewModel extends Accessor {
  constructor(properties?: any) {
    super();
  }

  initialize() {
    console.log("initialize vm ::", this);
  }

  @property()
  activeMissionId: string = "foo";

  @property()
  loaded = false;

  @property()
  ready = false;

  @property()
  user: PortalUser;
}

export default HomeViewModel;
