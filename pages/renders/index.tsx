import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RenderList } from "../../components/RenderItem";
import { JobStatus } from "../api/getJobStatus";
import { StitchedImage } from "../api/getRendered";
import { MapOutlined } from "@mui/icons-material";

/**
 * Show renders that are being processed as well as jobs that have been completed.
 */
export default function Renders() {
  const [jobs, setJS] = useState<JobStatus[]>([]);
  const [renders, setRenders] = useState<StitchedImage[]>([]);
  const [reqCount, setReqCount] = useState<number>(0);

  useEffect(() => {
    setTimeout(
      () => {
        fetch(`/api/getRendered`)
          .then((res) => res.json())
          .then((js) => {
            setRenders(js);
          })
          .catch(toast.error);

        fetch(`/api/getJobStatus`)
          .then((res) => res.json())
          .then((js) => {
            console.log(js);
            setJS(js);
            setReqCount(reqCount + 1);
          })
          .catch(toast.error);
      },
      // if the last known state was that there were running jobs,
      // we want to poll more frequently. Otherwise we poll less frequently.
      jobs.length > 0 ? 100 : 1000
    );
  }, [reqCount]);
  return (
    <div className="h-screen w-screen p-3">
      <div className="w-full py-4">
        <button
          className="text-center bg-black rounded text-white p-1 flex items-center
                gap-3 justify-center px-4"
        >
          <MapOutlined />
          Back to Map
        </button>
      </div>
      <RenderList jobs={jobs} renders={renders} />
    </div>
  );
}
