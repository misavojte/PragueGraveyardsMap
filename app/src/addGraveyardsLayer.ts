import { Map, MapSourceDataEvent, Marker, MarkerOptions } from "maplibre-gl";
import GeoJSON from 'geojson';
import { closeAnyOpenModalExcept } from "./modalFunctions";
import { fadeIn } from "./animations";

const GRAVEYARDS_LAYER_ID: string = "graveyards";
const PATH_TO_GRAVEYARDS_DATA: string = "./data/graveyards.geojson";
const PATH_TO_ADDITIONAL_DATA: string = "./data/additional_info.json";
const PATH_TO_IMAGES: string = './img/graveyards/';

export const COLOR_9_11 = '#ec7014';
export const COLOR_11 = '#cc4c02';
export const COLOR_NADOBY = '#969696';
export const COLOR_RANY = '#993404';

let markersOnMap: MarkerWithId[] = [];
let markersOnMapId: number[] = [];

/**
 * @constant
 * @name ratio
 * @description Used for the correct display of the map on high-resolution displays (canvas rendering).
 */
const ratio: number = window.devicePixelRatio;

/** Adds a graveyards features saved in a GeoJSON file to the map.
 * @param map - The MapLibre GL JS Map instance to which the features will be added.
 */
export function addGraveyards (map: Map): void {
  map.addSource(GRAVEYARDS_LAYER_ID, {
    type: 'geojson',
    data: PATH_TO_GRAVEYARDS_DATA,
    cluster: true,
    clusterProperties: {
      '9_11_stoleti': ['+', ['case', ['==', ['get', 'category'], '9_11_stoleti'], 1, 0]],
      '11_stoleti': ['+', ['case', ['==', ['get', 'category'], '11_stoleti'], 1, 0]],
      'rany_stredovek': ['+', ['case', ['==', ['get', 'category'], 'rany_stredovek'], 1, 0]],
      'nalezy_nadob': ['+', ['case', ['==', ['get', 'category'], 'nalezy_nadob'], 1, 0]],
    }
  })
  map.addLayer({
    id: GRAVEYARDS_LAYER_ID,
    type: 'circle',
    source: GRAVEYARDS_LAYER_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'match',
        ['get', 'category'],
        '9_11_stoleti', COLOR_9_11,
        '11_stoleti', COLOR_11,
        'rany_stredovek', COLOR_RANY,
        'nalezy_nadob', COLOR_NADOBY,
        COLOR_NADOBY
      ],
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  })
  map.on('data', (e: MapSourceDataEvent) => {
    if (e.sourceId !== GRAVEYARDS_LAYER_ID || !e.isSourceLoaded) return;
    map.on('move', () => testClusters(map));
    map.on('moveend', () => testClusters(map));
    testClusters(map)
  });
  addGraveyardsPopup(map)
}

/** Search for clusters from GRAVEYARDS_LAYER_ID source and paint them via Marker class.
 * @param map - The MapLibre GL JS Map instance to which the features will be added.
 */
function testClusters(map: Map): void {
    const features = map.querySourceFeatures(GRAVEYARDS_LAYER_ID, {
        sourceLayer: GRAVEYARDS_LAYER_ID,
        filter: ['has', 'point_count'],
    });
    const clusterIdsInView: number[] = [];
    const clusterMarkersInView: MarkerWithId[] = [];
    //adding clusters to map
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const geometry = feature.geometry as GeoJSON.Point;
        const coordinates = geometry.coordinates as [number, number];
        const pointCount = feature.properties?.point_count;
        const clusterId = feature.properties?.cluster_id;
        clusterIdsInView.push(clusterId);
        if (isClusterOnMap(clusterId)) continue
        const marker = new MarkerWithId(
            clusterId,{
              element: createClusterElement(pointCount, feature.properties?.['9_11_stoleti'], feature.properties?.['11_stoleti'], feature.properties?.['nalezy_nadob'], feature.properties?.['rany_stredovek']),
        })
        .setLngLat(coordinates)
        .addTo(map);
        clusterMarkersInView.push(marker);
    }

    //removing unused clusters from map
    for (let i = 0; i < markersOnMap.length; i++) {
        const marker = markersOnMap[i];
        if (clusterIdsInView.includes(marker.id)) {
          clusterMarkersInView.push(marker);
          continue
        }
        marker.remove();
    }
    markersOnMap = clusterMarkersInView;
    markersOnMapId = clusterIdsInView;

}

/** Check if current cluster is already on map by its id
 * @param clusterId - The id of the cluster.
 * @returns true if cluster is already on map, false otherwise
 */
function isClusterOnMap(clusterId: number): boolean {
    return markersOnMapId.includes(clusterId);
}

/** Create HTML element for a cluster - pie chart with total count of features in the middle.
 * For rendering of pie chart is used canvas element.
 * TODO: refactor this function
 * @param pointCount - The number of features in the cluster.
 * @param count9_11 - The number of features with category 9_11_stoleti.
 * @param count11 - The number of features with category 11_stoleti.
 * @param countNadoby - The number of features with category nalezy_nadob.
 * @param countRane - The number of features with category rany_stredovek.
 * @returns HTML element
 */
export function createClusterElement(pointCount: number, count9_11: number, count11: number, countNadoby: number, countRane: number): HTMLElement {

  const baseSize = pointCount >= 40 ? 60 : pointCount >= 20 ? 50 : pointCount >= 10 ? 40 : 30;
  const size = baseSize * ratio;
  const canvas = document.createElement('canvas');
  canvas.width = size
  canvas.height = size
  canvas.style.width = baseSize + 'px';
  canvas.style.height = baseSize + 'px';
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not defined');

  const nineElevenEnd = (count9_11 / pointCount) * 2 * Math.PI;
  const elevenEnd = nineElevenEnd + (count11 / pointCount) * 2 * Math.PI;
  const raneEnd = elevenEnd + (countRane / pointCount) * 2 * Math.PI;
  const nadobyEnd = raneEnd + (countNadoby / pointCount) * 2 * Math.PI;

  const drawArc = (start: number, end: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(size/2, size/2);
    ctx.arc(size/2, size/2, size/2, start, end);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

    drawArc(0, nineElevenEnd, COLOR_9_11);
    drawArc(nineElevenEnd, elevenEnd, COLOR_11);
    drawArc(elevenEnd, raneEnd, COLOR_RANY);
    drawArc(raneEnd, nadobyEnd, COLOR_NADOBY);

    //create a white circle in the middle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/4, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();

    //create a circle with white outline without fill
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2-1, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.restore();


    ctx.beginPath();
    ctx.font = `20px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(pointCount.toString(), size/2, size/2);

    return canvas

}

/** On click of a graveyards feature, fetch additional information about the feature and pass it to a function that opens a modal with the information.
 * Feature and additional information are saved in a GeoJSON file and a JSON file respectively and linked by the feature's ID.
 * @param map - The MapLibre GL JS Map instance to which the features belong.
 */
export function addGraveyardsPopup(map: Map): void {
map.on('click', GRAVEYARDS_LAYER_ID, (e) => {
    if (e.features === undefined) return
    const feature = e.features[0]
    const featureId = feature.properties?.id
    if (featureId === undefined) throw new Error('Feature has no ID')
    fetch(PATH_TO_ADDITIONAL_DATA)
      .then((response) => response.json())
      .then((data) => {
        const html = (data[featureId] !== undefined) ? parseGraveyardData(data[featureId] as GraveyardData, feature) : parseFeatureWihtoutAdditionalData(feature)
        openGraveyardModal(html)
      })
})
}

/** Parse GraveyardData object to HTML string
 * @param data - The GraveyardData object to be parsed.
 * @param feature - The GeoJSON feature to be parsed.
 * @returns HTML string
 */
function parseGraveyardData(data: GraveyardData, feature: GeoJSON.Feature): string {
  console.log(data)
    return `
        <h3>${data.name ? data.name : 'Název nevyplněn'}</h3>
        ${parseBaseData(feature)}
        <div class="meta-info">${data.address ? data.address : ''}</div>
        ${data.images ? parseImages(data.images) : ''}
        <p>${data.caption ? data.caption : 'Bez podrobnějšího textového popisu'}</p>
        <p class="meta-info">
              ${data.publication ? 'Zdrojová publikace: ' + data.publication : ''}${data.page ? ', stránka: ' + data.page.toString() : ''}
        </p>
    `
}

/** Create HTML string for a feature without additional information.
 * @param feature - The GeoJSON feature to be parsed.
 * @returns HTML string
 */
function parseFeatureWihtoutAdditionalData(feature: GeoJSON.Feature): string {
    return `
        <h3>Archeologická lokalita ${(feature.properties?.id) ? " č. " + feature.properties.id : ""}</h3>
        ${parseBaseData(feature)}
        <p>Atributy této archeologické lokality nebyly vyplněny.</p>
     `
}

/** Parse GraveyardImage[] to HTML string. Check if image exists and if not, return empty string.
 * Temporarily parse only first image.
 * @param images - The GraveyardImage[] to be parsed.
 */
function parseImages(images: GraveyardImage[]): string {
  const image = images[0]
  const path = PATH_TO_IMAGES + image.path
  return `
<figure>
  <img src="${path}" alt="${image.caption}" title="${image.caption}" class="graveyard-image">
  <figcaption>${image.caption}</figcaption>
</figure>
  `
}

/** Parse basic data from GeoJSON to HTML string
 * @param feature - The GeoJSON feature to be parsed.
 * @returns HTML string
 */
function parseBaseData(feature: GeoJSON.Feature): string {
    const properties = feature.properties
    if (properties === null) throw new Error('Feature has no properties')
    const geometry = feature.geometry as GeoJSON.Point
    return `
        <div class="meta-info">${formatCoordinates(geometry.coordinates)}</div>
        <div class="meta-info">${getCategory(properties.category)}</div>
    `
}

/** Get category of a feature.
 * @param category - string property of "category" key in GeoJSON feature.
 * @returns Category of the feature formatted in HTML for display.
 */
function getCategory(category: string): string {
  switch (category) {
    case '9_11_stoleti': return 'Hřbitov 9. - 11. století'
    case '11_stoleti': return 'Hřbitov 11. století'
    case 'rany_stredovek': return 'Hřbitov raného středověku'
    case 'nalezy_nadob': return 'Nález pohřebních nádob<br>(předpokládaný středověký hřbitov)'
    default: return 'Neznámá kategorie'
  }
}

/** Pass HTML string into a .modal-content element in #graveyard-modal and open the modal.
 * @param html - The HTML string to be passed into the .modal-content element.
 */
export function openGraveyardModal(html: string): void {
    const modal = document.getElementById('graveyard-info')
    if (modal == null) return
    const modalContent = modal.querySelector('.modal-content')
    if (modalContent == null) return
    closeAnyOpenModalExcept(document.getElementsByClassName('modal'), null).then(
        () => {modalContent.innerHTML = html; fadeIn(modal)}
    )
}

/** Format coordinates to DD°MM'SS.SSS" format.
 * @param coordinates - The coordinates to be formatted.
 * @returns Formatted coordinates.
 */
function formatCoordinates(coordinates: number[]): string {
  const getDirection = (index: number): string => {
    if (index === 0) return 'E'
    else return 'N'
  }
  return coordinates.map((coordinate, i) => {
    const degrees = Math.floor(coordinate)
    const minutes = Math.floor((coordinate - degrees) * 60)
    const seconds = ((coordinate - degrees) * 60 - minutes) * 60
    return `${degrees}°${minutes}'${seconds.toFixed(3)}"${getDirection(i)}`
  }).join(', ')
}

/** Additional information saved in JSON file about a graveyards feature.
 * @property name - The name of the graveyard.
 * @property address - The address of the graveyard.
 * @property description - A description of the graveyard.
 * @property publication - The publication that contains the information about the graveyard.
 * @property page - The page number of the publication that contains the information about the graveyard.
 * @property images - An array of images related to the graveyard.
 */
export interface GraveyardData {
    name: string
    address: string
    caption: string
    publication: string
    page: number
    images: GraveyardImage[] | undefined
}

/** Image data saved in GraveyardData.images.
 * @property path - The path to the image.
 * @property caption - The caption of the image.
 */
interface GraveyardImage {
    path: string
    caption: string
}

class MarkerWithId extends Marker {
    id: number
    constructor(id: number, options?: MarkerOptions) {
        super(options)
        this.id = id
    }

    addTo (map: Map): this {
      this.getElement().addEventListener('click', () => {
        map.flyTo({center: this.getLngLat(), zoom: map.getZoom()+1})
      })
      return super.addTo(map);
    }
}
