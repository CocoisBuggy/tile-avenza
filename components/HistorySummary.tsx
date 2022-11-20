import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { StitchedImage } from "../pages/api/getRendered";
import Link from "next/link";
import TimeAgo from "timeago-react";

type Props = {};

function TinyRecord(rendered: StitchedImage) {
  return (
    <Link href={`/result/${JSON.stringify(rendered.bounds)}`}>
      <div className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 text-black">
        <img src={rendered.url} className="h-8 w-8 rounded-full object-cover" />
        <TimeAgo datetime={rendered.createdAt.toString()} />
      </div>
    </Link>
  );
}

export default function HistorySummary({}: Props) {
  const [history, setHistory] = React.useState<StitchedImage[]>([]);

  useEffect(() => {
    fetch(`/api/getRendered`)
      .then((res) => res.json())
      .then((js) => {
        // only last 5 entries
        setHistory(js.slice(0, 5));
      })
      .catch(toast.error);
  }, []);

  return (
    <div className="flex flex-col gap-1 bg-white">
      {history.map((r) => (
        <TinyRecord {...r} key={r.bounds.join(",")} />
      ))}
    </div>
  );
}
