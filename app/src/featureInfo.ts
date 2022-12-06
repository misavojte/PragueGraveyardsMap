import { MapMouseEvent } from "maplibre-gl";

export function showGeneralFeatureInfo(e: MapMouseEvent): void {
  const lng = e.lngLat.lng.toFixed(4);
  const lat = e.lngLat.lat.toFixed(4);
  const modal = document.getElementById('feature-info');
  if(modal === null) return;
  const modalContent = modal.querySelector('.modal-content');
  if(modalContent === null) return;
  modalContent.innerHTML = `<p>Longitude: ${lng}</p><p>Latitude: ${lat}</p>`;
  modal.style.display = 'block';
  setTimeout(() => { modal.style.opacity = '1'; }, 1);
}