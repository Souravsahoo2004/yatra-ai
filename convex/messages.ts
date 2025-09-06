// messages.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Create a new trip conversation
export const createTrip = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trips", {
      userId: args.userId,
      title: args.title,
      destination: args.destination,
      status: "planning",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ✅ Get all trips for a user
export const getUserTrips = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trips")
      .withIndex("by_user_updated", (q) => 
        q.eq("userId", args.userId)
      )
      .order("desc")
      .collect();
  },
});

// ✅ Get a specific trip
export const getTrip = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.tripId);
  },
});

// ✅ Update trip details
export const updateTrip = mutation({
  args: {
    tripId: v.id("trips"),
    title: v.optional(v.string()),
    destination: v.optional(v.string()),
    status: v.optional(v.string()),
    tripPlanData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { tripId, ...updates } = args;
    return await ctx.db.patch(tripId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ✅ Save a message (updated)
export const addMessage = mutation({
  args: {
    tripId: v.id("trips"),
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    ui: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Update trip's last activity
    await ctx.db.patch(args.tripId, {
      updatedAt: Date.now(),
    });

    return await ctx.db.insert("messages", {
      tripId: args.tripId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      ui: args.ui,
      createdAt: Date.now(),
    });
  },
});

// ✅ Get all messages for a trip
export const getMessages = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .order("asc")
      .collect();
  },
});

// ✅ Delete one message
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

// ✅ Delete all messages for a trip
export const deleteMessagesForTrip = mutation({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    for (let msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});

// ✅ Delete entire trip and its messages
export const deleteTrip = mutation({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    // Delete all messages first
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    for (let msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // Delete the trip
    await ctx.db.delete(args.tripId);
  },
});
