// message.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Save a message
export const addMessage = mutation({
  args: {
    tripId: v.string(),
    userId: v.string(),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ✅ Get all messages for a trip
export const getMessages = query({
  args: { tripId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
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
  args: { tripId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
      .collect();

    for (let msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});