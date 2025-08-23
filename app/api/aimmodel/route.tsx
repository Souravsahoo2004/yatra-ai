import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import JSON5 from "json5";

// ✅ Configure OpenRouter
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Helper: Safe JSON parser using JSON5
function safeJsonParse(text: string) {
  try {
    // Remove markdown backticks
    text = text.replace(/```json|```/g, "").trim();
    // Extract first {...} block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON5.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error("❌ JSON5 Parse Error:", err);
  }
  // Fallback to raw text
  return { resp: text };
}

// Prompt for step-by-step questions
const PROMPT = `
You are an AI Trip Planner Agent.

RULES:
- Ask ONE relevant trip-planning question at a time in "resp".
- Always include "ui" as: "groupSize", "budget", "tripDuration", "final", "none".
- Output MUST be a single JSON object ONLY.

JSON schema:
{
  "resp": "string",
  "ui": "groupSize" | "budget" | "tripDuration" | "final" | "none"
}

IMPORTANT:
- Respond ONLY with JSON. No markdown, no explanations.
`;

// Prompt for final travel plan
const FINAL_PROMPT = `
Generate Travel Plan in JSON ONLY (no markdown, no extra text) with this schema:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

IMPORTANT:
- Return ONLY valid JSON according to schema.
- No markdown, no explanations, no extra keys.
`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages, isFinal } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ resp: "⚠️ No messages provided." });
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      max_tokens: isFinal ? 2500 : 300,
      messages: [
        {
          role: "system",
          content: (isFinal ? FINAL_PROMPT : PROMPT) + "\n\nReturn ONLY valid JSON.",
        },
        ...messages,
      ],
    });

    const message = completion.choices[0]?.message?.content ?? "";
    console.log("📝 AI raw response:", message);

    let parsedResp = safeJsonParse(message);

    // Nested parsing if resp contains stringified JSON
    if (typeof parsedResp.resp === "string" && parsedResp.resp.trim().startsWith("{")) {
      try {
        parsedResp.resp = JSON5.parse(parsedResp.resp);
      } catch (err) {
        console.error("❌ Nested JSON Parse Error:", err);
      }
    }

    // Log final trip plan for debugging
    if (isFinal && parsedResp.resp?.trip_plan) {
      console.log("📍 Trip Plan (Human-Readable):");
      console.log(JSON.stringify(parsedResp.resp.trip_plan, null, 2));
    }

    return NextResponse.json(parsedResp);
  } catch (error: any) {
    console.error(
      "❌ AI API Error:",
      error.response?.data || error.message || error
    );
    return NextResponse.json(
      {
        error: "Something went wrong while calling AI API",
        details: error.response?.data || error.message || String(error),
      },
      { status: 500 }
    );
  }
}
