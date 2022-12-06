import { Map } from "maplibre-gl";

/**
 Registers event listeners for a collection of elements that control the visibility of map overlays.
 @param switchers - The collection of elements that control the visibility of overlays.
 @param map - The MapLibre GL JS Map instance to which the overlays belong.
 */
export function registerOverlaySwitcherEvents(switchers: HTMLCollectionOf<Element>, map: Map): void {
  for (let i = 0; i < switchers.length; i++) {
    const switcher = switchers[i]
    if (!(switcher instanceof HTMLElement)) continue
    const overlayId = switcher.dataset.layer
    if (overlayId == null) continue
    switcher.addEventListener('click', (e: MouseEvent) => {
      if (e.target instanceof HTMLInputElement) return
      toggleActiveSwitchers(switchers, overlayId, map)
      toggleVisibility(switcher, overlayId, map)
    })
    switcher.querySelector('input')?.addEventListener('input', (e: Event) => {
      const input = e.target as HTMLInputElement
      map.setPaintProperty(overlayId, 'raster-opacity', Number(input.value)/100)
    })
  }
}

/**
 Toggles the visibility of an overlay associated with a given element.
 @param switcher - The element that controls the visibility of the overlay.
 @param overlayId - The ID of the overlay to toggle.
 @param map - The MapLibre GL JS Map instance to which the overlay belongs.
 */
function toggleVisibility(switcher: HTMLElement, overlayId: string, map: Map): void {
  const isOverlayVisible = switcher.classList.contains('active')
  map.setLayoutProperty(overlayId, 'visibility', isOverlayVisible ? 'none' : 'visible')
  switcher.classList.toggle('active')
}

/**
 Toggles the visibility of all active overlays.
 @param switchers - The collection of elements that control the visibility of overlays.
 @param skipOverlayId - The ID of the overlay to skip.
 @param map - The Mapbox Map instance to which the overlays belong.
 */
function toggleActiveSwitchers(switchers: HTMLCollectionOf<Element>, skipOverlayId: string, map: Map): void {
  for (let i = 0; i < switchers.length; i++) {
    const switcher = switchers[i]
    if (!switcher.classList.contains('active')) continue
    if (!(switcher instanceof HTMLElement)) continue
    const overlayId = switcher.dataset.layer
    if (overlayId === undefined) continue
    if (overlayId === skipOverlayId) continue
    toggleVisibility(switcher, overlayId, map)
  }
}