import Head from "next/head";
import { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import Footer from "../components/Footer";
import MapController, { MapState } from "../components/MapController";
import MapExporter from "../components/MapExporter";

export default function Home() {
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    latitude: 0,
    longitude: 0,
    zoom: 0,
  });

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
              viewState={mapState}
              onChange={setMapState}
              onMoveEnd={() => {}}
              onMapLoad={setMapRef}
            />
          </div>

          {mapRef && (
            <div className="absolute p-8">
              <div className="bg-black text-light p-4 rounded-lg border border-white">
                <MapExporter viewState={mapState} map={mapRef} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
