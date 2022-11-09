import React from "react";

type Props = {};

/**
 * It returns a footer with a bunch of links in it
 * @param {Props}  - Props
 * @returns A footer with a bunch of links
 */
export default function Footer({}: Props) {
  return (
    <footer className="p-4 bg-gray-800 text-light text-lg">
      <div className="flex-col flex md:flex-row w-full items-center gap-8 text-sm">
        <div className="flex-1"></div>

        <div>View on GitHub</div>
        <div>Colin Gale</div>
        <div>Avenza Maps</div>
        <div>
          <a href="https://www.flaticon.com/free-icons/map" title="map icons">
            Map icons created by Freepik - Flaticon
          </a>
        </div>
      </div>
    </footer>
  );
}
