import React, { useRef } from "react";
import Map, { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapSettings } from "./MapExporterSettings";

type Props = {
  viewState: MapState;
  onMove: (mapState: MapState) => void;
  onMoveEnd: (mapState: MapState) => void;
  onMapLoad: (map: MapRef) => void;
  mapSettings: MapSettings;
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
  onMove,
  onMoveEnd,
  onMapLoad,
  mapSettings,
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
        onMove(e.viewState);
      }}
      onLoad={_onMapLoad}
      mapStyle={mapSettings.mapStyle.url}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      minZoom={mapSettings.minZoom}
      maxZoom={mapSettings.maxZoom}
    />
  );
}
