// convex/trips.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Fetch all trips for logged-in user
export const getTrips = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Save a new trip (Option 1 - basic)
export const addTrip = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { userId, title, description }) => {
    return await ctx.db.insert("trips", {
      userId,
      title,
      description,
      createdAt: Date.now(),
    });
  },
});

// Save a new trip (Option 2 - detailed trip info)
export const addTripDetailed = mutation({
  args: {
    userId: v.string(),
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { userId, destination, startDate, endDate, notes }) => {
    return await ctx.db.insert("trips", {
      userId,
      destination,
      startDate,
      endDate,
      notes: notes || "",
      createdAt: Date.now(),
    });
  },
});

// Delete a trip
export const deleteTrip = mutation({
  args: { id: v.id("trips") },
  handler: async (ctx, { id }) => {
    const trip = await ctx.db.get(id);
    if (!trip) throw new Error("Trip not found");
    await ctx.db.delete(id);
    return true;
  },
});
