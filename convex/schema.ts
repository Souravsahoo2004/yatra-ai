//shema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  }),

  trips: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    destination: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // ✅ NEW table for chat messages
  messages: defineTable({
    tripId: v.string(),   // links to trips._id
    userId: v.string(),   // from Clerk
    role: v.string(),     // "user" | "assistant"
    content: v.string(),  // message text
    createdAt: v.number()
  })
  .index("by_trip", ["tripId"])   // easy to fetch all msgs for a trip
  .index("by_user", ["userId"]),  // if you ever want per-user chat history
});