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
      }).catch((error) => {
        // Silent error handling - no console logs visible to users
        console.error("Failed to save trip:", error);
      });
    }
  }, [trip, user, addTripDetailed]);

  // Returns nothing - completely invisible
  return null;
}
