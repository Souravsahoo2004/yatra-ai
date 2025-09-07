export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import TripClient from "./TripClient";

export default function TripPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading trip...</p>}>
      <TripClient />
    </Suspense>
  );
}
