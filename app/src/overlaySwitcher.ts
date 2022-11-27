import { Map } from "maplibre-gl";

export function registerOverlaySwitcherEvents(switchers: HTMLCollectionOf<Element>, map: Map): void {
  for (let i = 0; i < switchers.length; i++) {
    const switcher = switchers[i]
    if (!(switcher instanceof HTMLElement)) continue
    const overlayId = switcher.dataset.layer
    if (overlayId == null) continue
    switcher.addEventListener('click', (e: MouseEvent) => {
      if (e.target instanceof HTMLInputElement) return
      toggleVisibility(switcher, overlayId, map)
    })
    switcher.querySelector('input')?.addEventListener('input', (e: Event) => {
      const input = e.target as HTMLInputElement
      map.setPaintProperty(overlayId, 'raster-opacity', Number(input.value)/100)
    })
  }
}

function toggleVisibility(switcher: HTMLElement, overlayId: string, map: Map): void {
  const isOverlayVisible = switcher.classList.contains('active')
  map.setLayoutProperty(overlayId, 'visibility', isOverlayVisible ? 'none' : 'visible')
  switcher.classList.toggle('active')
}
