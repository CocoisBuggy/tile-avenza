import { Bounds } from "./mapMath";

var R = 6378137,
  sphericalScale = 0.5 / (Math.PI * R);

export type Tile = {
  x: number;
  y: number;
  z: number;
};

/* Adapted from: https://gist.github.com/mourner/8825883 */
export function xyz(bounds: Bounds, zoom: number): Tile[] {
  //north,west
  var min = project(bounds[1][1], bounds[0][0], zoom),
    //south,east
    max = project(bounds[0][1], bounds[1][0], zoom),
    tiles = [];

  for (var x = min.x; x <= max.x; x++) {
    for (var y = min.y; y <= max.y; y++) {
      tiles.push({
        x: x,
        y: y,
        z: zoom,
      });
    }
  }

  return tiles;
}

/*
 * Adapts a group of functions from Leaflet.js to work headlessly
 * https://github.com/Leaflet/Leaflet
 *
 * Combines/modifies the following methods:
 * L.Transformation._transform (src/geometry/Transformation.js)
 * L.CRS.scale (src/geo/crs/CRS.js)
 * L.CRS.latLngToPoint (src/geo/crs/CRS.js)
 * L.Projection.SphericalMercator.project (src/geo/projection/Projection.SphericalMercator.js)
 */
export function project(lat: number, lng: number, zoom: number) {
  var d = Math.PI / 180,
    max = 1 - 1e-15,
    sin = Math.max(Math.min(Math.sin(lat * d), max), -max),
    scale = 256 * Math.pow(2, zoom);

  var point = {
    x: R * lng * d,
    y: (R * Math.log((1 + sin) / (1 - sin))) / 2,
  };

  point.x = tiled(scale * (sphericalScale * point.x + 0.5));
  point.y = tiled(scale * (-sphericalScale * point.y + 0.5));

  return point;
}

export function tiled(num: number) {
  return Math.floor(num / 256);
}
