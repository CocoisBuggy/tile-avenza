// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Bounds } from "../../utils/mapMath";
import { UserPublic } from "./login";

type Data = {
  url: string;
  /** Size of the created image in bytes */
  imgSize: number;
};

export type StitchedImage = {
  url: string;
  imgSize: number;
  bounds: Bounds;
  createdBy: UserPublic;
  creadedAt: Date;
};

export function getStitchedImages(): StitchedImage[] {
  return [];
}

/** get a list of previously rendered satellite images */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StitchedImage[]>
) {}
