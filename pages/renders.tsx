import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JobsList from "../components/JobsList";
import { RenderList } from "../components/RenderItem";
import { JobStatus } from "./api/getJobStatus";
import { StitchedImage } from "./api/getRendered";

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
            setJS(js);
            setReqCount(reqCount + 1);
          })
          .catch(toast.error);
      },
      // if the last known state was that there were running jobs,
      // we want to poll more frequently. Otherwise we poll less frequently.
      jobs.length > 0 ? 100 : 1 * 1000
    );
  }, [reqCount]);
  return (
    <div className="h-screen w-screen p-3">
      <JobsList jobs={jobs} />
      <RenderList renders={renders} />
    </div>
  );
}
