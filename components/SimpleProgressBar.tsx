import React from "react";

const SimpleProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      className="bg-emerald-500 rounded-lg h-6"
      style={{ width: `${progress}%`, transition: "width 0.2s ease" }}
    />
  );
};

export default SimpleProgressBar;
