import { MapOutlined, PinDrop, ZoomIn } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { MapRef } from "react-map-gl";
import { areaInBounds, getTileUrls } from "../utils/mapMath";
import { MapState } from "./MapController";

type Props = {
  viewState: MapState;
  map: MapRef;
  tiles: number | null;
};

export default function MapExporter({ viewState, map, tiles }: Props) {
  const bounds = map.getBounds();
  // memoize the area calc
  const area = useMemo(() => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return areaInBounds([
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ]);
  }, [bounds.getSouthWest()]);

  useEffect(() => {}, [map]);

  return (
    <div className="">
      <div className="flex text-xs gap-4">
        <span>
          <PinDrop className="mr-2" />
          {viewState.latitude.toFixed(2)}, {viewState.longitude.toFixed(2)}
        </span>
        <span>
          <ZoomIn className="mr-2" />
          {viewState.zoom.toFixed(2)}
        </span>
        <span>
          <MapOutlined className="mr-2" />
          {(area / 1000000).toFixed(1)}
          <sup>2</sup> km
        </span>
      </div>

      <div className="mt-4 p-3 flex items-center justify-center text-xs h-32">
        {tiles === null ? (
          <div className="text-white">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div>
            <div>Tiles in area: {tiles}</div>
            <div>Approx size of image: {tiles * 52} bytes</div>
          </div>
        )}
      </div>
    </div>
  );
}
