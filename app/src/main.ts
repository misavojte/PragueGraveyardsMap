import './style.css'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'

import { registerOpenModalButtons, registerCloseButtonsOnModals } from './modalFunctions'
import { registerOverlaySwitcherEvents } from "./overlaySwitcher";

const map = new maplibregl.Map({
  container: 'map',
  style: '/prague2.json', // stylesheet location
  center: [14.41, 50.07], // starting position [lng, lat]
  zoom: 12, // starting zoom
  minZoom: 7,
});

map.addControl(new maplibregl.ScaleControl({}), 'bottom-left');
map.addControl(new maplibregl.NavigationControl({}),'top-left');

map.on('load', function () {
  map.addSource('ortofoto-source', {
    type: 'raster',
    tiles: [
      'https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=GR_ORTFOTORGB&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'
    ],
    tileSize: 256,
    attribution: 'Ortofoto © <a href="https://geoportal.cuzk.cz/" rel="noopener noreferrer"  target="_blank">ČÚZK</a>'
  })
  map.addSource('herget', {
    type: 'raster',
    tiles: [
      'https://gs-pub.praha.eu/arcgis/services/arch/mapove_podklady_archiv/MapServer/WmsServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=37&WIDTH=256&HEIGHT=256&&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'
    ],
    tileSize: 256,
  })
  map.addSource('juttner', {
    type: 'raster',
    tiles: [
      'https://gs-pub.praha.eu/arcgis/services/arch/mapove_podklady_archiv/MapServer/WmsServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=33&WIDTH=256&HEIGHT=256&&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'
    ],
    tileSize: 256,
  })
  map.addSource('o1938', {
    type: 'raster',
    tiles: [
      'https://gs-pub.praha.eu/arcgis/services/ort/ortofotomapa_archiv/MapServer/WmsServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=181%2C182%2C183&WIDTH=256&HEIGHT=256&&CRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}'
    ],
    tileSize: 256,
  })
  map.addLayer(
      {
        id: 'ortofoto',
        type: 'raster',
        source: 'ortofoto-source',
        layout: {visibility: 'none'},
        paint: {}
      })
  map.addLayer(
      {
        id: 'herget',
        type: 'raster',
        source: 'herget',
        layout: {visibility: 'none'},
        paint: {}
      })
  map.addLayer(
      {
        id: 'juttner',
        type: 'raster',
        source: 'juttner',
        layout: {visibility: 'none'},
        paint: {}
      })
  map.addLayer(
      {
        id: 'o1938',
        type: 'raster',
        source: 'o1938',
        layout: {visibility: 'none'},
        paint: {}
      })
});

(<any>window).map = map;

registerCloseButtonsOnModals(document.getElementsByClassName('modal'))
registerOpenModalButtons(document.getElementsByClassName('nav-item'))

registerOverlaySwitcherEvents(document.getElementsByClassName('overlay-switcher-item'), map)