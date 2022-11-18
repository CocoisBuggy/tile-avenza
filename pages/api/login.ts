// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

type LoginResult = {
  name: string;
  username: string;
  mapboxToken: string;
};

/**
 * A User is an object with a name, username, password, and mapboxToken property, where the name and
 * username are strings, the password is a string (unhashed), and the mapboxToken is a string or null.
 */
export type User = {
  name: string;
  username: string;
  password: string;
  /** This is the token that will be used to access the Mapbox */
  mapboxToken: string | null;
};

/** fite me 😡 */
export type UserPublic = {
  name: string;
  username: string;
};

export function getUsers() {
  return JSON.parse(fs.readFileSync("users.json", "utf8"));
}

export function getUser(username: string): User | null {
  return getUsers().find((user: User) => user.username === username) || null;
}

// let's be reasonable here. No one is pretending this is a secure way to go about this,
// but we don't anticipate an actual userbase. Any inflation in userbase would require
// an actual user system, this is essentially a stand-in so that other parts of the
// development may proceed.
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResult | { error: string }>
) {
  // Process a login attempt. If there needs to be such an implementation in the future, this is
  // where you would implement tokens for each user with their own scopes and limits. As we only
  // anticipate 3 or 4 users I won't waste time on it here. Nevertheless the code scaffolding has
  // been done.

  let user = getUser(req.body.username);

  if (user === null) {
    return res.status(401).json({ error: "user does not exist" });
  }

  if (user.password !== req.body.password) {
    return res.status(401).json({ error: "incorrect password" });
  }

  return res.status(200).json({
    mapboxToken: process.env.MAPBOX_TOKEN as string,
    username: user.username,
    name: user.name,
  });
}
