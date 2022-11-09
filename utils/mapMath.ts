import { LngLatBoundsLike } from "react-map-gl";
import * as turf from "@turf/turf";
import { MapState } from "../components/MapController";

export interface Tile {
  zoom: number;
  x: number;
  y: number;
}

export type Bounds = [[number, number], [number, number]];

/**
 * It takes a bounds object, converts it to a line string, then converts that line string to a bounding
 * box, and finally calculates the area of that bounding box
 * @param {Bounds} bounds - The bounds of the area you want to calculate the area of.
 * @returns The area of the bounding box in square meters
 */
export function areaInBounds(bounds: Bounds): number {
  const line = turf.lineString(bounds);
  const bbox = turf.bbox(line);
  return turf.area(turf.bboxPolygon(bbox));
}

/**
 * It converts a latitude and longitude into a tile coordinate
 * @param {number} lat - latitude of the point
 * @param {number} lng - longitude
 * @returns xtile and ytile
 */
export function getTile(lat: number, lng: number): Tile {
  let zoom = 17;
  let lat_rad = turf.degreesToRadians(lat);

  // pls no bit shift. I do not care, and this expresses the will clearly.
  let n = 2 ** zoom;

  let x = Math.round(n * ((lng + 180) / 360) * 100) / 100;
  let y =
    Math.round(
      ((n *
        (1 - Math.log((Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI))) /
        2) *
        100
    ) / 100;

  return { zoom, x, y };
}

function tileLon(tile: Tile) {
  return (tile.x / 2 ** tile.zoom) * 360 - 180;
}

function tileLat(tile: Tile) {
  let n = Math.PI - (2 * Math.PI * tile.y) / 2 ** tile.zoom;
  return turf.radiansToDegrees(Math.atan(Math.sinh(n)));
}

/**
 * It takes a tile and returns the bounds of that tile
 * @param {Tile} tile - The tile to get the bounds for.
 */
export function getTileBounds(tile: Tile): Bounds {
  let w = tileLon(tile);
  let s = tileLat(tile);

  let e = tileLon({ ...tile, x: tile.x + 1 });
  let n = tileLat({ ...tile, y: tile.y + 1 });

  return [
    [w, s],
    [e, n],
  ];
}
