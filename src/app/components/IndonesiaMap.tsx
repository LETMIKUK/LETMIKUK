"use client";

import World from "@react-map/indonesia";

export default function IndonesiaMap() {
  return (
    <World type="select-single" hoverColor="blue" hints={true} size={600} />
  );
}
