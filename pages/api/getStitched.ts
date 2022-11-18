// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  url: string;
  /** Size of the created image in bytes */
  imgSize: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {}
