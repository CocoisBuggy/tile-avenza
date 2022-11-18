// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

/** This will resolve the actual image data to the user, and will declare
 * correct mime type blah blah we all know how this works.
 *
 * The ultimate goal is that urls being routed here can be plugged into html
 * and any other mediated thingamajig. It would be trivial to inject data into
 * the dom from the request directly - but it is unpluggable. So we do this.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.writeHead(200, {
    "Content-Type": "image/jpg",
  });

  res.status(200).json({ name: "John Doe" });
}
