import {
  EventBusy,
  HourglassBottom,
  MapOutlined,
  Outbound,
  PinDrop,
  Router,
  Sync,
  ZoomIn,
} from "@mui/icons-material";
import { Alert, CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { MapRef } from "react-map-gl";
import { areaInBounds, Bounds } from "../utils/mapMath";
import { MapState } from "./MapController";
import prettyBytes from "pretty-bytes";
import MapExporterSettings, { MapSettings } from "./MapExporterSettings";
import { toast } from "react-toastify";
import { JobStatus } from "../pages/api/getJobStatus";
import { ReqData } from "../pages/api/makeNewRender";
import { v4 as uuidv4 } from "uuid";
import SimpleProgressBar from "./SimpleProgressBar";
import { useRouter } from "next/router";

type Props = {
  viewState: MapState;
  map: MapRef;
  tiles: number | null;
  mapSettings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
};

function makeReq(req: ReqData) {
  return fetch(
    "/api/makeNewRender?bounds=" +
      encodeURIComponent(JSON.stringify(req.bounds)) +
      "&mapStyle=" +
      req.mapStyle +
      "&jobId=" +
      req.jobId
  );
}

/** Purely a UI thing, not directly tied to the backend */
const maxTiles = 823;

export default function MapExporter({
  viewState,
  map,
  tiles,
  mapSettings: settings,
  onSettingsChange,
}: Props) {
  const router = useRouter();
  const [lastTilesState, setLastTilesState] = useState<number>(0);

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

  // Tile number should be updated on commission
  useEffect(() => {
    if (tiles !== null) setLastTilesState(tiles);
  }, [tiles]);

  function startJob() {
    const jobID = uuidv4();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const b: Bounds = [
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ];

    // Spawn the export process.
    // This will take a while, so we'll poll for the status.
    makeReq({ mapStyle: settings.mapStyle.url, bounds: b, jobId: jobID })
      .then((res) => res.json())
      .then((json) => {
        if (json.error !== undefined) {
          toast.error(json.error);
          return;
        }

        // Now take the user to the renders page.
        router.push("/renders");
      })
      .catch(toast.error);
  }

  return (
    <div className="">
      <div className="flex text-xs gap-4 items-center">
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
        <span>
          <MapExporterSettings
            mapSettings={settings}
            onChange={onSettingsChange}
          />
        </span>
      </div>

      <div className="mt-4 p-3 flex items-center justify-center text-xs">
        <div className="flex items-center justify-end w-full h-8 gap-2">
          {tiles === null && (
            <div className="text-white text-xs animate-spin">
              <Sync />
            </div>
          )}
          <div className="flex gap-2">
            <span>{lastTilesState} tiles</span> <span>|</span>
            <b>{prettyBytes(lastTilesState * (125 * 1000))}</b>
          </div>
        </div>
      </div>

      <div
        className="mb-3"
        style={{
          overflow: "hidden",
          height: lastTilesState > maxTiles ? "50px" : "0px",
          transition: "height 0.3s ease",
        }}
      >
        <Alert severity="error">Zoom area too large - too many tiles</Alert>
      </div>

      <div>
        <button
          disabled={lastTilesState > maxTiles}
          className="p-2 rounded-lg text-center w-full bg-white text-black disabled:cursor-not-allowed
          hover:ring hover:ring-white transition hover:text-white hover:bg-black"
          onClick={startJob}
        >
          <Outbound /> Render Visible Area
        </button>
      </div>
    </div>
  );
}
