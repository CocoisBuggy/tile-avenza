import React, { useRef } from "react";
import Map, { MapRef, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  viewState: MapState;
  onChange: (mapState: MapState) => void;
  onMoveEnd: (mapState: MapState) => void;
  onMapLoad: (map: MapRef) => void;
};

export type BBoxType = [[number, number], [number, number]];

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
  bbox?: BBoxType;
}

export default function MapController({
  viewState,
  onChange,
  onMoveEnd,
  onMapLoad,
}: Props) {
  const mapRef = useRef<MapRef>(null);

  const _onMapLoad = () => {
    if (mapRef.current !== null) {
      onMapLoad(mapRef.current);
    }
  };

  return (
    <Map
      {...viewState}
      ref={mapRef}
      onMoveEnd={(e) => {
        onMoveEnd(e.viewState);
      }}
      onMove={(e) => {
        onChange(e.viewState);
      }}
      onLoad={_onMapLoad}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    />
  );
}
