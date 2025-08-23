"use client";

import dynamic from "next/dynamic";

// Dynamically import your Map component with ssr disabled
const DynamicMap = dynamic(() => import('./_components/map'), { ssr: false });

export default function MapWrapper() {
  return <DynamicMap />;
}
