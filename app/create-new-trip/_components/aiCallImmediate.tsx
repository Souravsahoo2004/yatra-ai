"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function AiCallImmediate({ trip }: { trip: any }) {
  const addTripDetailed = useMutation(api.trips.addTripDetailed);
  const { user } = useUser();

  React.useEffect(() => {
    if (trip && user) {
      addTripDetailed({
        userId: user.id,
        destination: trip.destination || "Unknown Destination",
        startDate: trip.startDate || "N/A",
        endDate: trip.endDate || "N/A",
        notes: trip.notes || "",
      }).then(() => {
        console.log("✅ Trip saved to DB!");
      });
    }
  }, [trip, user, addTripDetailed]);

  return null; // no UI, just runs the save
}
