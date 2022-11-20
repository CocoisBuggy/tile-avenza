// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Bounds } from "../../utils/mapMath";
import { UserPublic } from "./login";
import fs from "fs";

export type StitchedImage = {
  url: string;
  /** Number of bytes in the image */
  bytes: number;
  bounds: Bounds;
  creadedAt: Date;
};

export function getStitchedImages(): StitchedImage[] {
  ensureDataDirectory();
  const imgs: StitchedImage[] = [];

  // We need to read each file, and extract some metadata about it
  return fs.readdirSync("./public/render").map((file) => {
    return {
      url: `/render/${file}`,
      bytes: 0,
      bounds: [
        [0, 0],
        [0, 0],
      ],
      creadedAt: new Date(),
    };
  });
}

/**
 * If the data directory doesn't exist, create it
 */
function ensureDataDirectory() {
  var dir = "./data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

/** get a list of previously rendered satellite images */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StitchedImage[]>
) {
  res.status(200).json(getStitchedImages());
}
