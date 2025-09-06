// schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  }),

  // ✅ NEW: Trip conversations table
  trips: defineTable({
    userId: v.string(),
    title: v.string(), // Auto-generated from first message or destination
    destination: v.optional(v.string()),
    status: v.string(), // "planning" | "completed" | "active"
    createdAt: v.number(),
    updatedAt: v.number(),
    tripPlanData: v.optional(v.any()), // Store the complete trip plan
  })
  .index("by_user", ["userId"])
  .index("by_user_updated", ["userId", "updatedAt"]),

  // ✅ UPDATED: Enhanced messages table
  messages: defineTable({
    tripId: v.id("trips"), // Now references trips table
    userId: v.string(),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
    ui: v.optional(v.string()), // Store UI state
    createdAt: v.number()
  })
  .index("by_trip", ["tripId"])
  .index("by_user", ["userId"]),
});
