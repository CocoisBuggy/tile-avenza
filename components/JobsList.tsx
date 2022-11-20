import React from "react";
import { JobStatus } from "../pages/api/getJobStatus";
import SimpleProgressBar from "./SimpleProgressBar";

type Props = {
  jobs: JobStatus[];
};

function Job(job: JobStatus) {
  return (
    <div className="p-2 w-full">
      <SimpleProgressBar progress={job.progress} />
    </div>
  );
}

export default function JobsList({ jobs }: Props) {
  return (
    <div className="w-full">
      {jobs.map((i) => (
        <Job key={i.jobID} {...i} />
      ))}
    </div>
  );
}
