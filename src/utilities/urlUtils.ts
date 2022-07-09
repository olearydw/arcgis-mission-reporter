/**
 * Module contains utility methods for dealing with URLs
 */

export function removeTrailingSlash(srcStr: string): string {
  return srcStr.replace(/\/$/, "");
}

export function getDefaultPortalItemThumbnail(portalUrl: string): string {
  return `${portalUrl}/home/js/arcgisonline/css/images/default_thumb.png`;
}

export function makeItemThumbnailUrl(restUrl: string, itemId: string, tnPartial: string): string {
  return `${restUrl}/content/items/${itemId}/info/${tnPartial}`;
}
