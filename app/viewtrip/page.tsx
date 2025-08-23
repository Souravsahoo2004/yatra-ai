"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { useState } from "react";

export default function ViewTripPage() {
  const { user } = useUser();
  const userId = user?.id || "";

  // Convex hooks
  const trips = useQuery(api.trips.getTrips, userId ? { userId } : "skip");
  const addTrip = useMutation(api.trips.addTrip);
  const deleteTrip = useMutation(api.trips.deleteTrip);

  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!user) {
    return (
      <div className="p-6 text-center text-xl">
        Please sign in to view and create trips.
      </div>
    );
  }

  // ✅ Handle trip creation
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTrip({ userId, title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Saved Trips</h1>

      {/* Trip creation form */}
      <form
        onSubmit={handleCreateTrip}
        className="mb-6 flex flex-col gap-2 border p-4 rounded-xl shadow-sm"
      >
        <Input
          placeholder="Trip title..."
          value={title}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Trip description..."
          value={description}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Button type="submit" className="w-fit">
          + Add Trip
        </Button>
      </form>

      {/* Show trips */}
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
