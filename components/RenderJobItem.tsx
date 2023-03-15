import TimeAgo from "timeago-react";
import { JobStatus } from "../pages/api/getJobStatus";
import SimpleProgressBar from "./SimpleProgressBar";
import { ColorRing } from "react-loader-spinner";

export function RenderJobItem({ job }: { job: JobStatus }) {
  return (
    <div
      className="shadow rounded-lg overflow-hidden hover:shadow-lg hover:shadow-violet-400
    transition hover:ring hover:ring-black flex flex-col"
    >
      <div className="flex flex-1 items-center justify-center">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>

      <div className="p-3 text-sm">
        <div className="flex mt-2 text-gray-900">
          <div className="flex-1">
            <div className="mb-2">
              <TimeAgo datetime={job.time} />
            </div>
            <SimpleProgressBar progress={job.progress} />
          </div>
        </div>
      </div>
    </div>
  );
}
