import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import JSON5 from "json5";

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryableError = error.status === 503 || 
                              error.status === 429 || 
                              error.message?.includes('overloaded') ||
                              error.message?.includes('quota');
      
      if (attempt === maxRetries || !isRetryableError) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`⏳ Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// ✅ FIXED: Better JSON parsing function
function safeJsonParse(text: string) {
  try {
    // Clean up the text
    text = text
      .replace(/``````/g, "")
      .trim();

    // Try parsing the entire text first
    try {
      const parsed = JSON5.parse(text);
      console.log("✅ Parsed JSON successfully:", parsed);
      return parsed;
    } catch (e) {
      console.log("⚠️ Direct parse failed, trying to extract JSON block");
      
      // Extract JSON block if embedded in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        console.log("🔍 Extracted JSON:", jsonStr.substring(0, 200) + "...");
        
        // Validate JSON is complete
        const openBraces = (jsonStr.match(/\{/g) || []).length;
        const closeBraces = (jsonStr.match(/\}/g) || []).length;
        
        if (openBraces === closeBraces) {
          const parsed = JSON5.parse(jsonStr);
          console.log("✅ Extracted and parsed JSON successfully");
          return parsed;
        } else {
          console.log("❌ Incomplete JSON - mismatched braces");
        }
      } else {
        console.log("❌ No JSON block found in text");
      }
    }
  } catch (err) {
    console.error("❌ JSON5 Parse Error:", err);
  }
  
  console.log("⚠️ Using fallback response");
  return { resp: text };
}

// ✅ Same prompts as before
const PROMPT = `
You are an AI Trip Planner Assistant. Your job is to gather trip information step by step.

CONVERSATION FLOW:
1. First ask about destination (if not mentioned)
2. Then ask about group size (ui: "groupSize") 
3. Then ask about budget (ui: "budget")
4. Then ask about duration (ui: "tripDuration")
5. Finally, move to trip planning (ui: "final")

RULES:
- Ask ONE specific question at a time based on what's missing
- Look at the conversation history to see what's already been answered
- Don't repeat questions that were already answered
- Progress logically through the steps
- When you have destination, group size, budget, and duration, use ui: "final"

OUTPUT FORMAT (JSON only):
{
  "resp": "Your specific question here",
  "ui": "groupSize" | "budget" | "tripDuration" | "final" | "none"
}

EXAMPLES:
- If no destination: {"resp": "Where would you like to travel?", "ui": "none"}
- If destination known but no group: {"resp": "How many people will be traveling?", "ui": "groupSize"}
- If group known but no budget: {"resp": "What's your budget range for this trip?", "ui": "budget"}
- If budget known but no duration: {"resp": "How many days would you like to travel?", "ui": "tripDuration"}
- If all info gathered: {"resp": "Perfect! Let me create your trip plan.", "ui": "final"}
`;

const FINAL_PROMPT = `
You are creating a detailed travel itinerary. Generate a complete trip plan based on the conversation.

Create a JSON response with this structure:
{
  "trip_plan": {
    "destination": "specific destination from conversation",
    "duration": "X days (from conversation)", 
    "origin": "starting location if mentioned, otherwise 'Not specified'",
    "budget": "budget level from conversation (Cheap/Moderate/Luxury)",
    "group_size": "number from conversation (e.g., '2 people', 'Solo traveler')",
    "hotels": [
      {
        "hotel_name": "Realistic hotel name for the destination",
        "hotel_address": "Full realistic address", 
        "price_per_night": "Price matching budget level",
        "hotel_image_url": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
        "geo_coordinates": {"latitude": 0.0, "longitude": 0.0},
        "rating": 4.5,
        "description": "Brief hotel description matching budget"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "Detailed plan for this day",
        "best_time_to_visit_day": "Morning/Afternoon/Evening",
        "activities": [
          {
            "place_name": "Specific attraction/place name",
            "place_details": "Detailed description of the place",
            "place_image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
            "geo_coordinates": {"latitude": 0.0, "longitude": 0.0},
            "place_address": "Realistic full address",
            "ticket_pricing": "Realistic pricing or 'Free'",
            "time_travel_each_location": "X hours",
            "best_time_to_visit": "Specific time recommendation"
          }
        ]
      }
    ]
  }
}

IMPORTANT: Return ONLY the JSON. No markdown, no explanations.
`;

// ✅ Better conversation analysis
function analyzeConversation(messages: any[]) {
  const conversation = messages.map(m => m.content.toLowerCase()).join(' ');
  
  const hasDestination = /taj mahal|agra|delhi|mumbai|goa|kerala|rajasthan|bhubaneswar|bangalore|chennai|kolkata|paris|london|tokyo|new york/.test(conversation) ||
                        /to |visit |going |travel to/.test(conversation);
  
  const hasGroupSize = /couple|solo|family|friends|\d+\s*people|\d+\s*person|just me|a couple|:2|:3|:4|:1/.test(conversation);
  
  const hasBudget = /cheap|moderate|luxury|budget|expensive|cost/.test(conversation) ||
                   /stay conscious|average side|donot worry about cost|keep cost/.test(conversation);
  
  const hasDuration = /\d+\s*days?|\d+\s*weeks?|days:|week|day/.test(conversation);
  
  return { hasDestination, hasGroupSize, hasBudget, hasDuration };
}

function formatMessagesForGemini(messages: any[]) {
  return messages.map(msg => {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    return {
      role: role,
      parts: [{ text: msg.content }]
    };
  });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages, isFinal } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ 
        resp: "Hi! I'm here to help you plan your trip. Where would you like to go?",
        ui: "none" 
      });
    }

    console.log("🔍 Request details - isFinal:", isFinal, "messages count:", messages.length);

    const modelOptions = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let result;
    let modelUsed = "";

    for (const modelName of modelOptions) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: isFinal ? 2000 : 300,
          }
        });

        let contextualPrompt;
        
        if (isFinal) {
          console.log("🎯 Generating FINAL trip plan");
          // ✅ For final trip plan, include full conversation context
          const fullConversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
          contextualPrompt = `${FINAL_PROMPT}\n\nFULL CONVERSATION CONTEXT:\n${fullConversation}\n\nGenerate the complete trip plan based on all the information gathered:`;
        } else {
          // ✅ Analyze conversation to determine next step
          const { hasDestination, hasGroupSize, hasBudget, hasDuration } = analyzeConversation(messages);
          
          const conversationSummary = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
          
          contextualPrompt = `${PROMPT}

CURRENT CONVERSATION:
${conversationSummary}

ANALYSIS:
- Destination mentioned: ${hasDestination}
- Group size mentioned: ${hasGroupSize}
- Budget mentioned: ${hasBudget}  
- Duration mentioned: ${hasDuration}

Based on this analysis, ask the next logical question. If all info is collected, use ui: "final".`;
        }

        console.log(`📤 Sending to ${modelName}...`);
        
        result = await retryWithBackoff(async () => {
          return await model.generateContent(contextualPrompt);
        }, 3, 1000);

        modelUsed = modelName;
        console.log(`✅ Success with model: ${modelName}`);
        break;

      } catch (error: any) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
        if (modelName === modelOptions[modelOptions.length - 1]) {
          throw error;
        }
        continue;
      }
    }

    if (!result) {
      throw new Error("All models failed");
    }

    const response = await result.response;
    const message = response.text();

    console.log(`📝 ${modelUsed} response:`, message);

    let parsedResp = safeJsonParse(message);

    // ✅ FIXED: Better validation logic
    if (isFinal) {
      // For final requests, we expect trip_plan
      if (parsedResp.trip_plan) {
        console.log("📍 Trip Plan Generated Successfully!");
        console.log("🎯 Trip Plan Data:", JSON.stringify(parsedResp.trip_plan, null, 2));
        return NextResponse.json(parsedResp);
      } else {
        console.error("❌ No trip_plan in final response");
        return NextResponse.json({
          error: "Failed to generate trip plan",
          details: "No trip_plan object found in response"
        }, { status: 500 });
      }
    } else {
      // For regular conversation, we expect resp
      if (!parsedResp.resp || parsedResp.resp === "question") {
        console.error("❌ Invalid response, using fallback");
        
        const { hasDestination, hasGroupSize, hasBudget, hasDuration } = analyzeConversation(messages);
        
        if (!hasDestination) {
          parsedResp = { resp: "Where would you like to travel?", ui: "none" };
        } else if (!hasGroupSize) {
          parsedResp = { resp: "How many people will be traveling?", ui: "groupSize" };
        } else if (!hasBudget) {
          parsedResp = { resp: "What's your budget range for this trip?", ui: "budget" };
        } else if (!hasDuration) {
          parsedResp = { resp: "How many days would you like to travel?", ui: "tripDuration" };
        } else {
          parsedResp = { resp: "Perfect! Let me create your trip plan.", ui: "final" };
        }
      }

      return NextResponse.json(parsedResp);
    }

  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    
    if (error.message?.includes("overloaded") || error.status === 503) {
      return NextResponse.json({
        resp: "🚦 The AI service is currently busy. Please wait a moment and try again.",
        ui: "none"
      }, { status: 200 });
    }
    
    if (error.message?.includes("quota") || error.status === 429) {
      return NextResponse.json({
        resp: "📊 Rate limit reached. Please wait a minute before trying again.",
        ui: "none"
      }, { status: 200 });
    }

    if (error.message?.includes("API_KEY")) {
      return NextResponse.json({
        resp: "🔐 API configuration issue. Please check your settings and try again.",
        ui: "none"
      }, { status: 200 });
    }

    return NextResponse.json({
      resp: "I'm having temporary difficulties. Please try again in a moment.",
      ui: "none"
    }, { status: 200 });
  }
}
