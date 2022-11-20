import * as turf from "@turf/turf";
import { Tile, xyz } from "./xyz";

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

export function getTileUrls(bounds: Bounds) {
  let zoom = 15;
  return xyz(bounds, zoom);
}

export function getUrl(tile: Tile) {
  const url = "https://api.mapbox.com/v4/mapbox.satellite";
  return `${url}/${tile.z}/${tile.x}/${tile.y}@2x.jpg90?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
}

export function centroidOfBounds(bounds: Bounds) {
  const line = turf.lineString(bounds);
  return turf.centroid(line);
}
