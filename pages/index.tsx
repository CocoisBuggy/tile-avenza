import Head from "next/head";
import { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import MapController, { MapState } from "../components/MapController";
import MapExporter from "../components/MapExporter";
import { defaultMapSettings } from "../components/MapExporterSettings";
import { getTileUrls, getUrl } from "../utils/mapMath";
import { Tile } from "../utils/xyz";

export default function Home() {
  const [mapSettings, setMapSettings] = useState(defaultMapSettings);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    latitude: 0,
    longitude: 0,
    zoom: 7,
  });
  const [tilesInArea, setTilesInArea] = useState<Tile[] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 10,
        });
      });
    }
  }, []);

  // This effect prevents state hanging on loading.
  useEffect(handleSetTile, [mapRef]);

  /** compute and change state of the number of tiles for the given viewstate */
  function handleSetTile() {
    if (mapRef !== null) {
      const bounds = mapRef.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      setTilesInArea(
        getTileUrls([
          [sw.lng, sw.lat],
          [ne.lng, ne.lat],
        ])
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Avenza Satellite</title>
        <meta
          name="description"
          content="Quick and dirty map-making utilities for the purposes of route finding (cool pun, ey?)"
        />
        <link rel="icon" href="/mapicon.png" />
      </Head>

      <main className="h-screen bg-secondary">
        <div className="flex flex-col h-screen">
          <div className="w-full flex-1">
            <MapController
              mapSettings={mapSettings}
              viewState={mapState}
              onMove={(s) => {
                if (tilesInArea !== null) {
                  console.log(getUrl(tilesInArea[0]));
                }

                setMapState(s);
                setTilesInArea(null);
              }}
              onMoveEnd={handleSetTile}
              onMapLoad={setMapRef}
            />
          </div>

          {mapRef && (
            <div className="absolute p-8">
              <div className="bg-black text-light p-4 rounded-lg border border-white">
                <MapExporter
                  mapSettings={mapSettings}
                  onSettingsChange={setMapSettings}
                  tiles={tilesInArea?.length || null}
                  viewState={mapState}
                  map={mapRef}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
