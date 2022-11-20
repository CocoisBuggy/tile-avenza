// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Bounds } from "../../utils/mapMath";
import fs from "fs";

export type StitchedImage = {
  url: string;
  /** Number of bytes in the image */
  bytes: number;
  bounds: Bounds;
  createdAt: Date;
};

export async function getStitchedImages(): Promise<StitchedImage[]> {
  ensureDataDirectory();
  const data: StitchedImage[] = [];

  // We need to read each file, and extract some metadata about it
  await Promise.all(
    fs.readdirSync("./public/render").map(async (file) => {
      const fileData = fs.readFileSync(`./public/render/${file}`);
      const fileMeta = fs.statSync(`./public/render/${file}`);

      data.push({
        url: `/render/${file}`,
        bytes: fileData.byteLength,
        bounds: JSON.parse(file.split(".jpg")[0]),
        createdAt: new Date(fileMeta.birthtime),
      });
    })
  );

  // return the data in dated order with new entries first
  return data.sort(function (a, b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StitchedImage[]>
) {
  res.status(200).json(await getStitchedImages());
}
