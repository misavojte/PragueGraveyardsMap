import { Map } from "maplibre-gl";

export function registerLegend(legend: HTMLCollectionOf<Element>, map: Map): void {
  for (let i = 0; i < legend.length; i++) {
    const legendItem = legend[i]
    if (!(legendItem instanceof HTMLElement)) continue
    map.on
  }
}