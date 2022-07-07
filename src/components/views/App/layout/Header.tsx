import { tsx } from "@arcgis/core/widgets/support/widget";
import PortalUser from "@arcgis/core/portal/PortalUser";

/**
 * Method for creating app header element
 */
export const makeHeader = (title: string, user: PortalUser) => {
  const appTitle = <h3>{title}</h3>;
  const avatar = user ? _makeUserAvatar(user) : null;
  return (
    <header>
      {appTitle}
      {avatar}
    </header>
  );
};

/**
 * Method for creating user avatar element
 */
function _makeUserAvatar(userInfo: PortalUser) {
  const displayName = userInfo.fullName ?? userInfo.username;
  const username = userInfo.username;
  const userId = userInfo.username;
  const tnUrl = userInfo.thumbnailUrl ?? null;

  return (
    <calcite-avatar
      full-name={displayName}
      scale="m"
      thumbnail={tnUrl}
      user-id={userId}
      username={username}
    ></calcite-avatar>
  );
}
