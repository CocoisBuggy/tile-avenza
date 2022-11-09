import {
  LocationCity,
  MapOutlined,
  Pin,
  PinDrop,
  ZoomIn,
  ZoomInMap,
} from "@mui/icons-material";
import React, { useMemo } from "react";
import { MapRef } from "react-map-gl";
import { areaInBounds } from "../utils/mapMath";
import { MapState } from "./MapController";

type Props = {
  viewState: MapState;
  map: MapRef;
};

export default function MapExporter({ viewState, map }: Props) {
  const bounds = map.getBounds();
  // memoize the area calc
  const area = useMemo(() => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return areaInBounds([
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ]);
  }, [bounds]);

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
    </div>
  );
}
