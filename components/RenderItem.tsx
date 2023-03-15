import { Download, Map } from "@mui/icons-material";
import prettyBytes from "pretty-bytes";
import React from "react";
import TimeAgo from "timeago-react";
import { StitchedImage } from "../pages/api/getRendered";
import { areaInBounds, centroidOfBounds } from "../utils/mapMath";
import { JobStatus } from "../pages/api/getJobStatus";
import { RenderJobItem } from "./RenderJobItem";
import { useRouter } from "next/router";

type Props = {
  renders: StitchedImage[];
  jobs: JobStatus[];
};

export function RenderItem({ render }: { render: StitchedImage }) {
  const router = useRouter();
  return (
    <div
      className="shadow rounded-lg overflow-hidden hover:shadow-lg hover:shadow-violet-400
    transition hover:ring hover:ring-black flex flex-col cursor-pointer"
      onClick={() => router.push(`/renders/${render.url.split("/").pop()}`)}
    >
      <img className="h-full object-cover" src={render.url} />

      <div className="flex-1" />

      <div className="p-3 text-sm">
        <TimeAgo datetime={render.createdAt} />

        <div className="flex mt-2 text-gray-900">
          <div className="flex-1">
            Area:{" "}
            <b>
              {(areaInBounds(render.bounds) / 1000).toFixed(2)}km<sup>2</sup>
            </b>
          </div>
          <div>
            Size: <b>{prettyBytes(render.bytes)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RenderList({ renders, jobs }: Props) {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
      {jobs.map((i) => (
        <RenderJobItem job={i} key={"jobID" + i.jobID} />
      ))}
      {renders.map((i) => (
        <RenderItem render={i} key={i.url} />
      ))}
    </div>
  );
}
