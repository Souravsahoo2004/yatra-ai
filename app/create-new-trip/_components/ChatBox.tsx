'use client';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, useAuth } from "@clerk/nextjs";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send, MapPin, Calendar, Users, DollarSign, Star, Clock } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

// UI components
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import FinalUi from './FinalUi';
import SelectDaysUi from './SelectDaysUi';

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
  tripPlan?: any;
};

function ChatBox() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const saveMessage = useMutation(api.messages.addMessage);

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripPlan, setTripPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoGenerating, setAutoGenerating] = useState(false);

  // ✅ Format trip plan for display in chat
  const formatTripPlanForChat = (tripData: any) => {
    if (!tripData?.trip_plan) return "❌ Trip plan not available";

    const trip = tripData.trip_plan;
    
    let formattedPlan = ` Your Complete Trip Plan\n\n`;
    
    // Basic Info
    formattedPlan += `📍 Destination: ${trip.destination}\n`;
    formattedPlan += `🏠 From: ${trip.origin}\n`;
    formattedPlan += `📅 Duration: ${trip.duration}\n`;
    formattedPlan += `👥 Group Size: ${trip.group_size}\n`;
    formattedPlan += `💰 Budget: ${trip.budget}\n\n`;
    
    // Hotels
    if (trip.hotels && trip.hotels.length > 0) {
      formattedPlan += `🏨 Accommodation:\n`;
      trip.hotels.forEach((hotel: any, index: number) => {
        formattedPlan += `${index + 1}. ${hotel.hotel_name}\n`;
        formattedPlan += `   📍 ${hotel.hotel_address}\n`;
        formattedPlan += `   💵 ${hotel.price_per_night}\n`;
        formattedPlan += `   ⭐ Rating: ${hotel.rating}/5\n`;
        formattedPlan += `   📝 ${hotel.description}\n\n`;
      });
    }
    
    // Itinerary
    if (trip.itinerary && trip.itinerary.length > 0) {
      formattedPlan += `📋 Daily Itinerary:\n\n`;
      trip.itinerary.forEach((day: any) => {
        formattedPlan += `Day ${day.day} - ${day.best_time_to_visit_day}\n`;
        formattedPlan += `${day.day_plan}\n\n`;
        
        if (day.activities && day.activities.length > 0) {
          formattedPlan += `Activities:\n`;
          day.activities.forEach((activity: any, index: number) => {
            formattedPlan += `${index + 1}. ${activity.place_name}\n`;
            formattedPlan += `   📝 ${activity.place_details}\n`;
            formattedPlan += `   📍 ${activity.place_address}\n`;
            formattedPlan += `   💵 Entry: ${activity.ticket_pricing}\n`;
            formattedPlan += `   ⏰ Duration: ${activity.time_travel_each_location}\n`;
            formattedPlan += `   🕐 Best Time: ${activity.best_time_to_visit}\n\n`;
          });
        }
      });
    }
    
    formattedPlan += `✨ Have an amazing trip! 🧳\n`;
    
    return formattedPlan;
  };

  // ✅ Handle View Trip button click
  const handleViewTrip = () => {
    console.log("🔍 Checking trip plan:", tripPlan); // Debug log
    
    if (!tripPlan) {
      console.error("No trip plan available");
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I don't have your trip plan ready yet. Please try generating it again.",
        ui: "none"
      }]);
      return;
    }

    const formattedTripPlan = formatTripPlanForChat(tripPlan);
    
    const tripDisplayMessage: Message = {
      role: "assistant",
      content: formattedTripPlan,
      ui: "none",
      tripPlan: tripPlan
    };

    setMessages((prev) => [...prev, tripDisplayMessage]);

    // Save the detailed trip plan to Convex
    if (user) {
      saveMessage({
        tripId: tripPlan?.trip_plan?._id || "temp",
        userId: user.id,
        role: "assistant",
        content: formattedTripPlan,
      }).catch(console.error);
    }

    console.log("📌 Full Trip Plan:", JSON.stringify(tripPlan, null, 2));
  };

  // ✅ FIXED: Auto-generate trip plan when ui: "final" is received
  const autoGenerateTripPlan = async (currentMessages: Message[]) => {
    if (autoGenerating) return; // Prevent duplicate calls
    
    setAutoGenerating(true);
    setLoading(true);

    try {
      const token = await getToken({ template: 'convex' });
      
      // Add a system message to trigger final generation
      const finalMessage: Message = {
        role: "user",
        content: "Generate my complete trip plan now"
      };

      console.log("🤖 Auto-generating trip plan...");

      const result = await axios.post(
        '/api/aimmodel',
        {
          messages: [...currentMessages, finalMessage],
          isFinal: true, // ✅ Force final generation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 45000, // Longer timeout for trip plan generation
        }
      );

      const resp = result.data || {};
      console.log("📨 Final API Response:", resp);

      // ✅ FIXED: Check for backend error first
      if (resp.error) {
        throw new Error(resp.error);
      }

      if (resp.trip_plan) {
        console.log("🎯 Trip plan received:", resp.trip_plan);
        setTripPlan(resp); // Store the entire response
        
        const aiMsg: Message = { 
          role: "assistant", 
          content: "🎉 Perfect! Your trip plan is ready. Click the **'View Trip'** button below to see your complete itinerary!",
          ui: "final",
          tripPlan: resp
        };
        
        setMessages((prev) => [...prev, aiMsg]);
        
        // Save to Convex
        if (user) {
          try {
            await saveMessage({
              tripId: resp.trip_plan._id || "temp",
              userId: user.id,
              role: "assistant",
              content: aiMsg.content,
            });
          } catch (convexError) {
            console.error("❌ Error saving to Convex:", convexError);
          }
        }
      } else {
        throw new Error("No trip plan in response");
      }

    } catch (error: any) {
      console.error('❌ Error auto-generating trip plan:', error);
      
      let errorMessage = "⚠️ I had trouble generating your trip plan. Let me try again...";
      
      if (error.response?.status === 500) {
        errorMessage = "🤖 The AI had trouble creating your trip plan. Please try starting over.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "⏱️ Trip generation took too long. Please try again.";
      }
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMessage,
        ui: "none"
      }]);
    }

    setLoading(false);
    setAutoGenerating(false);
  };

  // ✅ Auto-select UI options
  const handleUiSelection = (value: string) => {
    setUserInput(value);
    setError(null);
    setTimeout(() => {
      onSend();
    }, 100);
  };

  // ✅ MAIN SEND FUNCTION - Fixed flow
  const onSend = async () => {
    if (!userInput.trim() || loading) return;

    setLoading(true);
    setError(null);

    const newMsg: Message = {
      role: "user",
      content: userInput.trim(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setUserInput('');

    try {
      const token = await getToken({ template: 'convex' });
      const result = await axios.post(
        '/api/aimmodel',
        {
          messages: updatedMessages,
          isFinal: false, // Always false for regular conversation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      const resp = result.data || {};
      console.log("📨 API Response:", resp);

      if (!resp.resp && !resp.trip_plan) {
        throw new Error("Invalid API response structure");
      }

      // Handle normal AI response
      let aiContent = resp.resp || "🤔 I didn't understand that. Could you try again?";
      aiContent = decodeURIComponent(aiContent.replace(/\+/g, ' '));

      const aiMsg: Message = {
        role: "assistant",
        content: aiContent,
        ui: resp.ui || "none",
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // ✅ AUTO-GENERATE TRIP PLAN when ui: "final" is received
      if (resp.ui === 'final') {
        console.log("🚀 Detected final step, auto-generating trip plan...");
        setIsFinal(true);
        
        // Wait a moment then auto-generate
        setTimeout(() => {
          autoGenerateTripPlan(finalMessages);
        }, 1000);
      }

      // Save messages to Convex
      if (user) {
        try {
          await saveMessage({
            tripId: tripPlan?._id || "temp",
            userId: user.id,
            role: "user",
            content: newMsg.content,
          });
          
          await saveMessage({
            tripId: tripPlan?._id || "temp",
            userId: user.id,
            role: "assistant",
            content: aiMsg.content,
          });
        } catch (convexError) {
          console.error("❌ Error saving to Convex:", convexError);
        }
      }

    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ Request timed out. Please try again with a shorter message.";
      } else if (error.response?.status === 401) {
        errorMessage = "🔐 Authentication failed. Please refresh the page and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "🚫 Server error. Please try again in a moment.";
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: errorMessage,
          ui: "none"
        },
      ]);
    }

    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // ✅ UI renderer with enhanced final UI
  const RenderGenerativeUi = (ui?: string, messageTripPlan?: any) => {
    if (!ui || ui === 'none') return null;

    try {
      if (ui === 'budget') {
        return <BudgetUi onSelectOption={handleUiSelection} />;
      }
      if (ui === 'groupSize') {
        return <GroupSizeUi onSelectOption={handleUiSelection} />;
      }
      if (ui === 'tripDuration') {
        return <SelectDaysUi onSelectOption={handleUiSelection} />;
      }
      if (ui === 'final') {
        return (
          <div className="mt-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">
                {tripPlan ? "Trip Ready!" : autoGenerating ? "Generating Trip Plan..." : "Preparing Trip..."}
              </span>
            </div>
            
            {loading || autoGenerating ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader className="animate-spin w-5 h-5 text-purple-600" />
                <span className="text-purple-700">Creating your perfect trip...</span>
              </div>
            ) : tripPlan ? (
              <Button
                onClick={handleViewTrip}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Complete Trip Plan
              </Button>
            ) : (
              <div className="text-center text-gray-600">
                <p className="text-sm">Preparing your trip details...</p>
              </div>
            )}
            
            {tripPlan && (
              <div className="mt-3 text-sm text-gray-600 text-center">
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tripPlan?.trip_plan?.destination || 'Destination'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {tripPlan?.trip_plan?.duration || 'Duration'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tripPlan?.trip_plan?.group_size || 'Group'}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      }
    } catch (error) {
      console.error("❌ Error rendering UI component:", error);
      return null;
    }
    
    return null;
  };

  return (
    <div className="h-[80vh] flex flex-col">
      {/* Empty state */}
      {messages.length === 0 && (
        <EmptyBoxState onSelectOption={handleUiSelection} />
      )}

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          msg.role === 'user' ? (
            <div className="flex justify-end" key={index}>
              <div className="max-w-lg bg-purple-700 text-white py-2 px-4 rounded-lg">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start" key={index}>
              <div className="max-w-4xl bg-gray-100 text-black py-2 px-4 rounded-lg">
                <div className="whitespace-pre-line mb-2">
                  {msg.content}
                </div>
                {RenderGenerativeUi(msg.ui, msg.tripPlan)}
              </div>
            </div>
          )
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-gray-100 text-black py-2 px-4 rounded-lg flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              <span>{autoGenerating ? "Creating your trip plan..." : "Planning your trip..."}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="max-w-lg bg-red-100 text-red-700 py-2 px-4 rounded-lg border border-red-200">
              {error}
            </div>
          </div>
        )}
      </section>

      {/* Input box */}
      <section className="p-4">
        <div className="border rounded-2xl p-4 shadow-lg relative w-full max-w-xl mx-auto">
          <Textarea
            placeholder="Start typing here..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            size={'icon'}
            className="absolute bottom-6 right-6 bg-purple-700 text-white hover:bg-purple-600 shadow-md transition-all"
            onClick={onSend}
            disabled={loading || !userInput.trim()}
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
