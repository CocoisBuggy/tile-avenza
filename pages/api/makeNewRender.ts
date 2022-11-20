// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Bounds, getTileUrls, getUrl } from "../../utils/mapMath";
import { Tile } from "../../utils/xyz";
import { JobStatus } from "./getJobStatus";
import joinImages from "join-images";
import fs from "fs";

type Data = {
  error?: string;
};

export type ReqData = {
  jobId: string;
  bounds: Bounds;
  mapStyle: string;
};

/**
 * It takes a tile object and returns a string that is the path to the cached image for that tile
 * @param {Tile} tile - Tile - The tile object that contains the x, y, and z coordinates of the tile.
 * @returns A string that is the path to the cache file for the given tile.
 */
function cachePath(tile: Tile) {
  return `./cache/${tile.z}-${tile.x}-${tile.y}.jpg`;
}

async function makeRender(tiles: Tile[]) {
  // create render file if not exists
  if (!fs.existsSync("./public/render")) {
    fs.mkdirSync("./public/render");
  }

  const tileColumns: Tile[][] = [[tiles[0]]];

  var currentRow = 0;
  tiles.forEach((tile, index) => {
    if (index === 0) return; // skip first one

    const lastTile =
      tileColumns[currentRow][tileColumns[currentRow].length - 1];

    if (tile.x > lastTile.x) {
      currentRow++;
      tileColumns[currentRow] = [tile];
      return;
    }

    tileColumns[currentRow].push(tile);
  });

  const columns: Buffer[] = [];

  for (const column of tileColumns) {
    await joinImages(
      column.map((tile) => cachePath(tile)),
      { direction: "vertical" }
    ).then(async (img) => {
      columns.push(await img.jpeg().toBuffer());
    });
  }

  return joinImages(columns, { direction: "horizontal" });
}

/** Get tile, but pass over if it's already in cache. */
async function downloadTile(tile: Tile) {
  const path = cachePath(tile);

  // create cache file if not exists
  if (!fs.existsSync("./cache")) {
    fs.mkdirSync("./cache");
  }

  // check if tile is in cache
  if (fs.existsSync(path)) {
    return; // The tile is cached
  }

  await fetch(getUrl(tile))
    .then((res) => {
      if (res.status !== 200) {
        console.log("Couldn't download tile: ", res.statusText);
        throw new Error("tile download failed");
      }

      return res.arrayBuffer();
    })
    .then((data) => {
      // write the data
      fs.appendFileSync(path, Buffer.from(data));
    })
    .catch(console.error);
}

export const Jobs: { [k: string]: JobStatus } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { jobId, mapStyle } = req.query;
  const bounds = JSON.parse(req.query.bounds as string) as Bounds;

  if (typeof jobId !== "string") {
    res.status(400).json({ error: "jobId is required and  must be a string" });
    return;
  }
  if (typeof mapStyle !== "string") {
    res
      .status(400)
      .json({ error: "mapStyle is required and must be a string" });
    return;
  }
  if (bounds === undefined) {
    res.status(400).json({ error: "bounds are required" });
    return;
  }
  if (bounds.length !== 2) {
    res.status(400).json({ error: "bounds appear malformed" });
    return;
  }

  console.log("Creating new job", jobId);
  res.status(200).json({}); // we return no error.

  // Create the new job.
  Jobs[jobId] = {
    progress: 0,
    jobID: jobId,
    time: new Date().toString(),
  };

  // With the above validation negotiated we can keep going.
  const tiles = getTileUrls(bounds);
  // download / cache tiles
  var idx = 0;
  for (const tile of tiles) {
    await downloadTile(tile);
    idx++;

    // Update job data
    Jobs[jobId].progress = Math.round((idx / (tiles.length + 1)) * 100);
    Jobs[jobId].time = new Date().toString();
  }

  // Now we actually create the high res canvas
  console.log("rendering tiles into one canavs...");

  try {
    await makeRender(tiles).then(async (img) => {
      await img.toFile(`./public/render/${JSON.stringify(bounds)}.jpg`);
      console.log("rendering complete!");
    });
  } catch (error) {
    console.error(error);
  } finally {
    // Delete the job
    delete Jobs[jobId];
  }
}
