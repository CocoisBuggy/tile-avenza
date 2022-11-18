import { getUsers, User, UserPublic } from "../pages/api/login";
import { Bounds } from "../utils/mapMath";
import { openDb } from "./init";

/** the data as it should ideally be circulated outside of this module */
export type Rendered = {
  id: number;
  url: string;
  imgSize: number;
  bounds: Bounds;
  createdBy: UserPublic;
};

/** Data as it appears in the database */
type RenderedRecord = {
  id: number;
  imagedata: Blob;
  top_left_lat: number;
  top_left_lon: number;
  bottom_right_lat: number;
  bottom_right_lon: number;
  created_at: number;
  user_name: string;
  actual_name: string;
};

/**
 * Add a new rendered 📷 result to the database.
 * needs to be supplied with raw image data and required metadata.
 *
 * Once inside the database, the image data may be retrieved by users
 * via the API thereafter.
 */
export async function addRendered(
  bounds: Bounds,
  data: Blob
): Promise<Rendered> {
  let db = await openDb();
  let { lastID } = await db.run(
    `INSERT INTO rendered 
    (
        imagedata,
        top_left_lat,
        top_left_lon,
        bottom_right_lat,
        bottom_right_lon,
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data,
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1],
      new Date().getTime(),
    ]
  );

  const res = await db.get("SELECT * FROM rendered WHERE id = :lastID", {
    ":lastID": lastID,
  });

  db.close();

  return res as Rendered;
}

/** get safe 📷 data for use outside of this module */
export async function getRendered(): Promise<Rendered[]> {
  let db = await openDb();
  const rendered = await db.get("SELECT * FROM rendered");
  db.close();

  const res: Rendered[] = [];

  rendered.forEach((i: RenderedRecord) => {
    res.push({
      url: `/api/rendered/${i.id}.jpg`,
      id: i.id,
      imgSize: i.imagedata.length,
      bounds: [
        [i.top_left_lat, i.top_left_lon],
        [i.bottom_right_lat, i.bottom_right_lon],
      ],
      createdBy: {
        username: i.user_name,
        name: i.actual_name,
      },
    });
  });

  return res;
}

/**
 * Get the rendered 📷 with the given id, or null if it doesn't exist.
 */
export async function getRenderedById(id: number): Promise<Rendered | null> {
  return (await getRendered()).find((i) => i.id === id) || null;
}
