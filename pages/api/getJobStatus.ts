import { NextApiRequest, NextApiResponse } from "next";
import { Jobs } from "./makeNewRender";

export type JobStatus = {
  time: string;
  progress: number;
  jobID: string;
};

/** get the status of a given JobID */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<JobStatus[]>
) {
  res.status(200).json(Object.values(Jobs));
}
