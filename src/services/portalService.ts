// arcgis.core
import esriRequest from "@arcgis/core/request";

// typings
import { FederatedServer } from "../typings/portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import { MissionReportData } from "../typings/mission";

export async function getFederatedServers(
  serversUrl: string
): Promise<FederatedServer[]> {
  const response = await esriRequest(serversUrl, {
    query: { f: "json" }
  });

  return response.data?.servers ?? [];
}

export async function getPortalItemsByIds(
  itemIds: string[]
): Promise<PortalItem[]> {
  // arr of portal items for return
  const items: PortalItem[] = [];
  try {
    // create promise for each item
    const promises = itemIds.map((itemId) => {
      const portalItemPromise = loadPortalItemById(itemId);
      return portalItemPromise;
    });

    // call all settled to get valid items
    const allResults = await Promise.allSettled(promises);

    // loop over all settled results for items
    allResults.forEach((result) => {
      if (result.status === "fulfilled") {
        const item: PortalItem = result.value;
        items.push(item);
      }
    });

    return items;
  } catch (e) {}
}

export async function getPortalItemData(
  restUrl: string,
  itemId: string
): Promise<MissionReportData> {
  const itemDataUrl = `${restUrl}/content/items/${itemId}/data`;
  const itemData = await esriRequest(itemDataUrl, {
    query: {
      f: "json"
    }
  });
  return itemData.data;
}

async function loadPortalItemById(itemId: string): Promise<PortalItem> {
  try {
    const item = await new PortalItem({
      id: itemId
    });
    return await item.load();
  } catch (e) {}
}
