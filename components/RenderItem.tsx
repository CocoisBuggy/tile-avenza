import { Download, Map } from "@mui/icons-material";
import prettyBytes from "pretty-bytes";
import React from "react";
import { StitchedImage } from "../pages/api/getRendered";
import { areaInBounds, centroidOfBounds } from "../utils/mapMath";

type Props = {
  renders: StitchedImage[];
};

export function RenderItem({ render }: { render: StitchedImage }) {
  return (
    <div
      className="shadow rounded-lg overflow-hidden hover:shadow-lg hover:shadow-violet-400
    transition hover:ring hover:ring-black flex flex-col"
    >
      <div className="w-full flex items-center text-violet-600 p-1">
        <div className="flex-1 pl-4">
          <div className="flex items-center gap-2">
            <Map fontSize="inherit" />
            {centroidOfBounds(render.bounds).geometry.coordinates.join(", ")}
          </div>
        </div>

        <button className="p-2 text-sm hover:text-emerald-500 transition">
          <Download />
        </button>
      </div>

      <img className="h-full object-cover" src={render.url} />

      <div className="flex-1" />

      <div className="p-3 text-sm">
        <div className="flex mt-2">
          <div className="flex-1">
            Area: {areaInBounds(render.bounds)}km<sup>2</sup>
          </div>
          <div>Size: {prettyBytes(render.bytes)}</div>
        </div>
      </div>
    </div>
  );
}

export function RenderList({ renders }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {renders.map((i) => (
        <RenderItem render={i} key={i.url} />
      ))}
    </div>
  );
}
