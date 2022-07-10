
import * as intl from "@arcgis/core/intl";

export function formatDate(epoch: number): string {
  const d = new Date(epoch);
  return d.toLocaleDateString(userLocale(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}

export function userLocale(): string {
  return intl.getLocale();
}