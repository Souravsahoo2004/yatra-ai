"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function ViewTripPage() {
  const { user } = useUser();
  const userId = user?.id || "";

  // Convex hooks - removed addTrip since no longer needed
  const trips = useQuery(api.trips.getTrips, userId ? { userId } : "skip");
  const deleteTrip = useMutation(api.trips.deleteTrip);

  if (!user) {
    return (
      <div className="p-6 text-center text-xl">
        Please sign in to view and create trips.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Show trips only */}
      {!trips ? (
        <p>Loading trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-gray-500">No trips saved yet.</p>
      ) : (
        <div className="space-y-4">
          {trips.map((trip: any) => (
            <div
              key={trip._id}
              className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{trip.title}</h2>
                <p className="text-gray-600">{trip.description}</p>
                <span className="text-xs text-gray-400">
                  {new Date(trip.createdAt).toLocaleString()}
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={() => deleteTrip({ id: trip._id })}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
