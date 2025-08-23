import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription:v.optional( v.string()),
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
})  