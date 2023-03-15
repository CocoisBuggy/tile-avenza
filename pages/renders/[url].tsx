import { Download, MapOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import prettyBytes from "pretty-bytes";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { areaInBounds } from "../../utils/mapMath";
import { StitchedImage } from "../api/getRendered";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";

export default function SpecificRender() {
  const [renders, setRenders] = useState<StitchedImage[]>([]);
  const [render, setRender] = useState<StitchedImage | null>(null);

  const router = useRouter();
  const { url } = router.query;
  const imgUrl = `/render/${url}`;

  useEffect(() => {
    fetch(`/api/getRendered`)
      .then((res) => res.json())
      .then((js) => {
        setRenders(js);
        setRender(js.find((r: StitchedImage) => r.url === imgUrl) || null);
      })
      .catch(toast.error);
  }, [url]);

  if (!render) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
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
    );
  }

  return (
    <div className="p-4 flex flex-col h-screen pb-8">
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        <button
          className="text-center bg-black rounded text-white p-1 flex items-center
                gap-3 justify-center px-4"
          onClick={() => router.push("/")}
        >
          <MapOutlined />
          Back to Map
        </button>

        <button
          className="text-center bg-black rounded text-white p-1 flex items-center
                gap-3 justify-center px-4"
          onClick={() => router.push("/renders")}
        >
          Back to Renders
        </button>
      </div>

      <div className="overflow-hidden rounded-xl shadow-lg flex-1 my-6">
        <img className="w-full h-full object-cover" src={imgUrl} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className="flex gap-3 sm:mt-2 text-gray-900 px-2 flex-1
            text-sm sm:text-base"
        >
          <div>
            Area:{" "}
            <b>
              {(areaInBounds(render.bounds) / 1000).toFixed(2)}km<sup>2</sup>
            </b>
          </div>
          <div>
            Size: <b>{prettyBytes(render.bytes)}</b>
          </div>
        </div>

        <a href={imgUrl} download="Yay a map!">
          <button
            className="text-center bg-black rounded-lg text-white p-1 flex items-center
            gap-3 justify-center px-7"
          >
            <Download />
            Download
          </button>
        </a>
      </div>
    </div>
  );
}
